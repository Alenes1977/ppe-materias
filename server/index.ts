import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import passport from 'passport';
import type { CasUser } from './cas';
import { createSamlStrategy } from './saml2cas';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * EntityID registrado en CAS. El ACS se construye como
 * `{APP_BASE_URL}/api/auth/cas/callback` y debe vivir en este mismo origen:
 * la cookie de sesión es SameSite=Lax.
 */
const DEFAULT_ISSUER = 'https://guiadocente.unav.edu';
const DEV_SESSION_SECRET = 'dev-only-change-me';
const MIN_SESSION_SECRET_LENGTH = 32;
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Arrancar en producción con un secreto conocido equivale a no firmar las
 * sesiones. El proceso falla al arrancar para que ECS no dé una task "healthy"
 * sin autenticación real.
 */
const resolveSessionSecret = (): string => {
  const secret = process.env.SESSION_SECRET?.trim();

  if (!isProduction) {
    if (secret) return secret;
    console.warn(
      '[cas] SESSION_SECRET sin definir: se usa un secreto de desarrollo. No desplegar así.',
    );
    return DEV_SESSION_SECRET;
  }

  if (!secret) {
    throw new Error(
      'SESSION_SECRET es obligatoria en producción y no está definida.',
    );
  }
  if (secret === DEV_SESSION_SECRET) {
    throw new Error(
      'SESSION_SECRET tiene el valor de ejemplo. Genera un secreto propio.',
    );
  }
  if (secret.length < MIN_SESSION_SECRET_LENGTH) {
    throw new Error(
      `SESSION_SECRET debe tener al menos ${MIN_SESSION_SECRET_LENGTH} caracteres.`,
    );
  }
  return secret;
};

const resolveAppBaseUrl = (): string => {
  const raw = (
    process.env.APP_BASE_URL ??
    (isProduction ? DEFAULT_ISSUER : 'http://localhost:5173')
  ).replace(/\/$/, '');

  if (isProduction && !raw.startsWith('https://')) {
    throw new Error(
      `APP_BASE_URL debe usar https en producción (recibido: ${raw}).`,
    );
  }

  return raw;
};

/**
 * Solo rutas relativas de la propia aplicación. Evita que `returnTo` se
 * convierta en un open redirect.
 */
const isSafeReturnPath = (value: string): boolean => {
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//') || value.startsWith('/\\')) return false;
  if (value.includes('://') || value.includes('\\')) return false;
  return true;
};

const app = express();
const port = Number(process.env.PORT ?? 8181);
const appBaseUrl = resolveAppBaseUrl();
const casBaseUrl = (
  process.env.CAS_BASE_URL ?? 'https://cas.unav.es/cas'
).replace(/\/$/, '');
const sessionSecret = resolveSessionSecret();

const callbackUrl = `${appBaseUrl}/api/auth/cas/callback`;
/**
 * Dónde vive la SPA. En producción es el mismo origen que `/api`. En
 * `npm run dev:all` Express no sirve HTML: tras el CAS hay que volver a Vite.
 */
const spaOrigin = isProduction
  ? appBaseUrl
  : (process.env.DEV_FRONTEND_URL ?? 'http://localhost:5173').replace(
      /\/$/,
      '',
    );
const samlEntryPoint = (
  process.env.SAML_ENTRY_POINT ?? `${casBaseUrl}/idp/profile/SAML2/Redirect/SSO`
).replace(/\/$/, '');
const samlIssuer = (process.env.SAML_ISSUER ?? DEFAULT_ISSUER).replace(
  /\/$/,
  '',
);
const defaultIdpCert = isProduction ? 'cas.crt' : 'caspre.crt';
const samlIdpCertPath = process.env.SAML_IDP_CERT_PATH?.trim()
  ? path.resolve(process.env.SAML_IDP_CERT_PATH)
  : path.join(__dirname, defaultIdpCert);

const saml = await createSamlStrategy({
  callbackUrl,
  entryPoint: samlEntryPoint,
  issuer: samlIssuer,
  idpCertPath: samlIdpCertPath,
});

/** Duración de la sesión. Cookie y JWT caducan a la vez. */
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;
const RETURN_TO_COOKIE = 'guia_return_to';
const RETURN_TO_MAX_AGE_MS = 10 * 60 * 1000;
const SESSION_COOKIE = 'guia_session';

const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: appBaseUrl.startsWith('https://'),
};

const createSessionToken = (user: CasUser) =>
  jwt.sign(
    {
      sub: user.subject,
      email: user.email,
      name: user.displayName,
      provider: 'cas-unav',
    },
    sessionSecret,
    { expiresIn: SESSION_MAX_AGE_MS / 1000 },
  );

const readSession = (token: string | undefined) => {
  if (!token) return null;
  try {
    return jwt.verify(token, sessionSecret);
  } catch {
    return null;
  }
};

const rememberReturnTo = (res: express.Response, returnTo: string) => {
  res.cookie(RETURN_TO_COOKIE, returnTo, {
    ...cookieBase,
    maxAge: RETURN_TO_MAX_AGE_MS,
  });
};

/**
 * Navegación a una página de la SPA: redirigir al IdP. El resto (assets, API)
 * responde 401 para no mandar al CAS un `.js` como destino de vuelta.
 */
const isDocumentNavigation = (req: express.Request) =>
  req.method === 'GET' &&
  req.accepts('html') === 'html' &&
  path.extname(req.path) === '';

const sendHealth = (_req: express.Request, res: express.Response) => {
  res.type('text/plain').send('ok');
};

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: appBaseUrl,
    credentials: true,
  }),
);

passport.use(saml as unknown as passport.Strategy);
app.use(passport.initialize());

/**
 * Health del ALB / ECS / Docker HEALTHCHECK. Tiene que ir *antes* del
 * middleware de sesión: un GET sin cookie a una ruta sin extensión se
 * interpretaría como navegación HTML y redirigiría al CAS.
 */
app.get('/health', sendHealth);
app.get('/api/health', sendHealth);

app.get('/login/metadata', (_req, res) => {
  res.type('application/xml');
  res.send(saml.generateServiceProviderMetadata(null));
});

app.get('/api/auth/cas/failure', (_req, res) => {
  res.status(401).send('No se ha podido iniciar sesión con el CAS.');
});

app.get('/api/auth/cas/login', (req, res, next) => {
  const fromQuery =
    typeof req.query.returnTo === 'string' ? req.query.returnTo : '';
  const fromCookie =
    typeof req.cookies[RETURN_TO_COOKIE] === 'string'
      ? req.cookies[RETURN_TO_COOKIE]
      : '';
  const candidate = isSafeReturnPath(fromQuery)
    ? fromQuery
    : isSafeReturnPath(fromCookie)
      ? fromCookie
      : '/';
  // RelayState viaja en el POST del IdP; una cookie SameSite=Lax no. El spec
  // limita el valor a 80 bytes: si la ruta no cabe, volvemos al inicio.
  const relayState = candidate.length <= 80 ? candidate : '/';
  res.clearCookie(RETURN_TO_COOKIE, cookieBase);

  passport.authenticate('saml', {
    session: false,
    additionalParams: { RelayState: relayState },
    failureRedirect: '/api/auth/cas/failure',
  } as passport.AuthenticateOptions)(req, res, next);
});

app.post(
  '/api/auth/cas/callback',
  express.urlencoded({ extended: false }),
  passport.authenticate('saml', {
    session: false,
    failureRedirect: '/api/auth/cas/failure',
  }),
  (req, res) => {
    try {
      const user = req.user as CasUser;

      res.cookie(SESSION_COOKIE, createSessionToken(user), {
        ...cookieBase,
        maxAge: SESSION_MAX_AGE_MS,
      });
      res.clearCookie(RETURN_TO_COOKIE, cookieBase);
      console.log(
        '[cas] Usuario autenticado y cookie de sesión emitida:',
        user,
      );

      const relay =
        typeof req.body?.RelayState === 'string' ? req.body.RelayState : '/';
      const destPath = isSafeReturnPath(relay) ? relay : '/';
      res.redirect(`${spaOrigin}${destPath}`);
    } catch (error) {
      console.error('[cas] Fallo al emitir la sesión SAML:', error);
      res.status(401).send('No se ha podido validar la sesión con el CAS.');
    }
  },
);

app.get('/api/auth/session', (req, res) => {
  const session = readSession(req.cookies[SESSION_COOKIE]);
  if (!session) {
    res.status(401).json({ user: null });
    return;
  }
  res.json({ user: session });
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, cookieBase);
  res.json({ ok: true });
});

app.use((req, res, next) => {
  if (readSession(req.cookies[SESSION_COOKIE])) {
    next();
    return;
  }

  if (isDocumentNavigation(req)) {
    const returnTo = isSafeReturnPath(req.originalUrl) ? req.originalUrl : '/';
    rememberReturnTo(res, returnTo);
    res.redirect('/api/auth/cas/login');
    return;
  }

  res.status(401).json({ error: 'unauthenticated' });
});

/**
 * En producción el mismo proceso sirve la SPA (`dist/`) y `/api`, para que la
 * cookie de sesión viva en el mismo origen. En desarrollo Vite sigue sirviendo
 * el frontend en :5173 y proxifica `/api`.
 */
if (isProduction) {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(
    express.static(distPath, { index: false, maxAge: '1y', immutable: true }),
  );
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
} else {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/login/metadata') {
      next();
      return;
    }
    res.redirect(`${spaOrigin}${req.originalUrl}`);
  });
}

app.listen(port, () => {
  console.log(`[cas] Backend escuchando en el puerto ${port}`);
  console.log(`[cas] Aplicación y callback bajo ${appBaseUrl}`);
  console.log(`[cas] SPA (tras login): ${spaOrigin}`);
  console.log(`[cas] SAML ACS: ${callbackUrl}`);
  console.log(`[cas] SAML IdP: ${samlEntryPoint}`);
  console.log(`[cas] SAML issuer: ${samlIssuer}`);
});
