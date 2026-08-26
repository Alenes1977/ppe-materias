import { Strategy as SamlStrategy } from '@node-saml/passport-saml';
import type { VerifiedCallback } from '@node-saml/passport-saml';
import type { Profile } from '@node-saml/node-saml';
import { readFile } from 'node:fs/promises';
import type { CasUser } from './cas';

/** Subconjunto del profile de Passport-SAML que realmente leemos. */
type SamlProfile = {
  nameID?: string;
  attributes?: Record<string, unknown>;
} & Record<string, unknown>;

/** eduPersonPrincipalName */
const EPPN_OID = 'urn:oid:1.3.6.1.4.1.5923.1.1.1.6';
/** mail */
const MAIL_OID = 'urn:oid:0.9.2342.19200300.100.1.3';
/** cn */
const CN_OID = 'urn:oid:2.5.4.3';
/** givenName */
const GIVEN_NAME_OID = 'urn:oid:2.5.4.42';
/** sn */
const SN_OID = 'urn:oid:2.5.4.4';
/** eduPersonAffiliation */
const AFFILIATION_OID = 'urn:oid:1.3.6.1.4.1.5923.1.1.1.1';
/** eduPersonEntitlement */
const ENTITLEMENT_OID = 'urn:oid:1.3.6.1.4.1.5923.1.1.1.7';

const firstString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) return value;
  if (Array.isArray(value) && typeof value[0] === 'string' && value[0].trim()) {
    return value[0];
  }
  return null;
};

const asList = (value: unknown): unknown[] => {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
};

/**
 * Lee un atributo SAML por OID o por nombre corto. El IdP de CAS a veces
 * entrega solo OIDs en `attributes`, a veces también el nombre corto en el
 * propio profile.
 */
const attr = (profile: SamlProfile, ...keys: string[]): string | null => {
  const attributes = (profile.attributes ?? {}) as Record<string, unknown>;
  for (const key of keys) {
    const found = firstString(attributes[key]) ?? firstString(profile[key]);
    if (found) return found;
  }
  return null;
};

const attrList = (profile: SamlProfile, ...keys: string[]): unknown[] => {
  const attributes = (profile.attributes ?? {}) as Record<string, unknown>;
  for (const key of keys) {
    if (attributes[key] != null) return asList(attributes[key]);
    if (profile[key] != null) return asList(profile[key]);
  }
  return [];
};

export const profileToCasUser = (profile: SamlProfile): CasUser => {
  const email = attr(profile, MAIL_OID, 'mail', 'email');
  const subject =
    attr(profile, EPPN_OID, 'eduPersonPrincipalName') ??
    profile.nameID ??
    email ??
    '';

  return {
    subject,
    email,
    displayName: attr(profile, CN_OID, 'displayName', 'cn', 'name'),
    attributes: {
      mail: email,
      givenName: attr(profile, GIVEN_NAME_OID, 'givenName'),
      sn: attr(profile, SN_OID, 'sn'),
      eduPersonAffiliation: attrList(
        profile,
        AFFILIATION_OID,
        'eduPersonAffiliation',
      ),
      eduPersonEntitlement: attrList(
        profile,
        ENTITLEMENT_OID,
        'eduPersonEntitlement',
      ),
    },
  };
};

export type SamlStrategyOptions = {
  callbackUrl: string;
  entryPoint: string;
  issuer: string;
  idpCertPath: string;
};

/**
 * Factory: hay que crearla *después* de `dotenv.config()`. Un `new SamlStrategy`
 * en el import leería las variables todavía vacías.
 */
export const createSamlStrategy = async ({
  callbackUrl,
  entryPoint,
  issuer,
  idpCertPath,
}: SamlStrategyOptions) => {
  const idpCert = await readFile(idpCertPath, 'utf-8');

  const verify = (profile: Profile | null, done: VerifiedCallback) => {
    if (!profile) {
      done(new Error('El IdP no ha enviado perfil SAML.'));
      return;
    }
    done(
      null,
      profileToCasUser(profile as SamlProfile) as unknown as Record<
        string,
        unknown
      >,
    );
  };

  // El tercer argumento es el verify de SLO; no lo usamos, pero la API lo exige.
  return new SamlStrategy(
    {
      callbackUrl,
      entryPoint,
      issuer,
      idpCert,
    },
    verify,
    verify,
  );
};
