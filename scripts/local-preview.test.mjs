import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveConfig } from 'vite';

async function config(command, mode, isPreview = false) {
  return resolveConfig(
    { mode, logLevel: 'silent' },
    command,
    mode,
    'development',
    isPreview,
  );
}

test('La vista local escucha en loopback y no conecta con el backend CAS', async () => {
  const resolved = await config('serve', 'local-preview');
  assert.equal(resolved.define.__LOCAL_PREVIEW__, 'true');
  assert.equal(resolved.server.host, '127.0.0.1');
  assert.equal(resolved.server.strictPort, true);
  assert.equal(resolved.server.proxy, undefined);
});

test('El desarrollo habitual y el build mantienen CAS', async () => {
  for (const [command, mode] of [
    ['serve', 'development'],
    ['build', 'production'],
  ]) {
    const resolved = await config(command, mode);
    assert.equal(resolved.define.__LOCAL_PREVIEW__, 'false');
    assert.ok(resolved.server.proxy['/api']);
    assert.ok(resolved.server.proxy['/saml']);
  }
});

test('No se permite compilar ni servir un preview con local-preview', async () => {
  await assert.rejects(config('build', 'local-preview'), /no se permite/);
  await assert.rejects(config('serve', 'local-preview', true), /no se permite/);
});

test('NODE_ENV=production impide activar la vista local', async () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    await assert.rejects(config('serve', 'local-preview'), /no se permite/);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});
