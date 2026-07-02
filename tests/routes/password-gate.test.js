import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { TextEncoder } from 'node:util';
import vm from 'node:vm';
import { distDir, relative, walkFiles } from '../utils/project.js';

const distExists = existsSync(distDir);
const protectedPagePath = path.join(distDir, 'apps', 'green-tech-transition', 'index.html');
const protectedStorageKey = 'app-hub-green-tech-transition-auth';
const testPassword = 'test-password';
const testPasswordHash = createHash('sha256').update(testPassword).digest('hex');

test('only Green Tech Transition is password protected', {
  skip: !distExists && 'Run pnpm build first',
}, () => {
  const htmlFiles = builtHtmlFiles();

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, 'utf8');

    if (filePath === protectedPagePath) {
      assert.match(html, /<html lang="en" class="password-protected"/, `${relative(filePath)} should mark the page protected`);
      assert.match(html, /<section class="password-gate"/, `${relative(filePath)} is missing the password gate`);
      assert.match(html, /data-password-form/, `${relative(filePath)} is missing the password form`);
      assert.match(html, /data-password-hash/, `${relative(filePath)} is missing the password hash`);
      assert.match(html, new RegExp(`data-password-storage-key="${protectedStorageKey}"`), `${relative(filePath)} is using the wrong storage key`);
      assert.match(html, /id="site-password"/, `${relative(filePath)} is missing the password input`);
      continue;
    }

    assert.doesNotMatch(html, /class="password-protected"/, `${relative(filePath)} should not be password protected`);
    assert.doesNotMatch(html, /<section class="password-gate"/, `${relative(filePath)} should not render the password gate`);
    assert.doesNotMatch(html, /data-password-form/, `${relative(filePath)} should not render the password form`);
  }
});

test('built pages do not contain a plain password', {
  skip: !distExists && 'Run pnpm build first',
}, () => {
  const htmlFiles = builtHtmlFiles();

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, 'utf8');

    assert.doesNotMatch(html, /APP_HUB_PASSWORD\s*=\s*['"]/, `${relative(filePath)} must not contain a plain password`);
    assert.doesNotMatch(html, /apphub/i, `${relative(filePath)} must not contain the old plain password`);
  }
});

test('wrong password keeps Green Tech Transition locked', {
  skip: !distExists && 'Run pnpm build first',
}, async () => {
  const html = withTestPasswordHash(readProtectedPage());
  const result = await runPasswordGate(html, { submittedPassword: 'wrong-password' });

  assert.equal(result.preventedSubmit, true, 'password form should not perform a page submit');
  assert.equal(result.isUnlocked, false, 'wrong password must not unlock the page');
  assert.equal(result.storedAuth, undefined, 'wrong password must not be saved as authenticated');
  assert.equal(result.errorHidden, false, 'wrong password should reveal the error message');
  assert.equal(result.inputValue, '', 'wrong password should clear the input');
  assert.equal(result.inputFocused, true, 'wrong password should focus the input again');
});

test('correct password unlocks Green Tech Transition', {
  skip: !distExists && 'Run pnpm build first',
}, async () => {
  const html = withTestPasswordHash(readProtectedPage());
  const result = await runPasswordGate(html, { submittedPassword: testPassword });

  assert.equal(result.preventedSubmit, true, 'password form should not perform a page submit');
  assert.equal(result.isUnlocked, true, 'Green Tech Transition should unlock with the correct password');
  assert.equal(result.storedAuth, 'ok', 'Green Tech Transition should remember authentication');
  assert.equal(result.errorHidden, true, 'Green Tech Transition should keep the error hidden');
});

test('saved authentication unlocks Green Tech Transition without asking again', {
  skip: !distExists && 'Run pnpm build first',
}, async () => {
  const result = await runPasswordGate(readProtectedPage(), {
    storedAuth: new Map([[protectedStorageKey, 'ok']]),
  });

  assert.equal(result.isUnlocked, true, 'Green Tech Transition should unlock from saved authentication');
});

function builtHtmlFiles() {
  return walkFiles(distDir, (filePath) => filePath.endsWith('.html'));
}

function readProtectedPage() {
  return readFileSync(protectedPagePath, 'utf8');
}

function withTestPasswordHash(html) {
  return html.replace(/data-password-hash(?:="[^"]*")?/, `data-password-hash="${testPasswordHash}"`);
}

async function runPasswordGate(html, { submittedPassword, storedAuth } = {}) {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .filter((script) => script.includes('app-hub-auth') || script.includes('sha256'));

  assert.ok(scripts.length >= 1, 'protected page must include the password gate script');

  let preventedSubmit = false;
  let inputFocused = false;
  let submitHandler;
  const classes = new Set();
  const storage = storedAuth ?? new Map();
  const passwordHash = readDataAttribute(html, 'password-hash');
  const passwordStorageKey = readDataAttribute(html, 'password-storage-key');

  class HTMLElement {}
  class HTMLFormElement extends HTMLElement {
    dataset = { passwordHash, passwordStorageKey };
  }
  class HTMLInputElement extends HTMLElement {
    value = '';

    focus() {
      inputFocused = true;
    }
  }

  const form = new HTMLFormElement();
  form.addEventListener = (eventName, handler) => {
    if (eventName === 'submit') submitHandler = handler;
  };
  const input = new HTMLInputElement();
  const error = new HTMLElement();
  error.hidden = true;

  const context = vm.createContext({
    crypto: webcrypto,
    document: {
      documentElement: {
        classList: {
          add(value) {
            classes.add(value);
          },
        },
      },
      querySelector(selector) {
        return {
          '[data-password-form]': form,
          '#site-password': input,
          '[data-password-error]': error,
        }[selector] ?? null;
      },
    },
    localStorage: {
      getItem(key) {
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        storage.set(key, value);
      },
    },
    HTMLElement,
    HTMLFormElement,
    HTMLInputElement,
    TextEncoder,
    Uint8Array,
  });

  for (const script of scripts) {
    vm.runInContext(script, context);
  }

  if (submittedPassword !== undefined) {
    assert.equal(typeof submitHandler, 'function', 'password form must register a submit handler');
    input.value = submittedPassword;
    await submitHandler({
      preventDefault() {
        preventedSubmit = true;
      },
    });
  }

  return {
    errorHidden: error.hidden,
    inputFocused,
    inputValue: input.value,
    isUnlocked: classes.has('auth-ok'),
    preventedSubmit,
    storedAuth: storage.get(protectedStorageKey),
  };
}

function readDataAttribute(html, name) {
  const match = html.match(new RegExp(`data-${name}(?:="([^"]*)")?`));
  return match?.[1] ?? '';
}
