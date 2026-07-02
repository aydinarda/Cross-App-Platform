import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { TextEncoder } from 'node:util';
import vm from 'node:vm';
import { distDir, relative, walkFiles } from '../utils/project.js';

const distExists = existsSync(distDir);
const testPassword = 'test-password';
const testPasswordHash = createHash('sha256').update(testPassword).digest('hex');

test('built pages show only the password gate before authentication', {
  skip: !distExists && 'Run pnpm build first',
}, () => {
  const htmlFiles = builtHtmlFiles();

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, 'utf8');

    assert.match(html, /<section class="password-gate"/, `${relative(filePath)} is missing the password gate`);
    assert.match(html, /data-password-form/, `${relative(filePath)} is missing the password form`);
    assert.match(html, /data-password-hash/, `${relative(filePath)} is missing the password hash`);
    assert.match(html, /id="site-password"/, `${relative(filePath)} is missing the password input`);
    assert.match(
      html,
      /html:not\(.auth-ok\) .site-header,html:not\(.auth-ok\) main,html:not\(.auth-ok\) .site-footer\{display:none\}/,
      `${relative(filePath)} does not hide page content before authentication`
    );
    assert.match(
      html,
      /html.auth-ok .password-gate\{display:none\}/,
      `${relative(filePath)} does not hide the password gate after authentication`
    );
  }
});

test('built pages do not contain the old plain password', {
  skip: !distExists && 'Run pnpm build first',
}, () => {
  const htmlFiles = builtHtmlFiles();

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, 'utf8');

    assert.doesNotMatch(html, /APP_HUB_PASSWORD\s*=\s*['"]/, `${relative(filePath)} must not contain a plain password`);
    assert.doesNotMatch(html, /apphub/i, `${relative(filePath)} must not contain the old plain password`);
  }
});

test('wrong password keeps access locked', { skip: !distExists && 'Run pnpm build first' }, async () => {
  const homeHtml = withTestPasswordHash(readFileSync(`${distDir}/index.html`, 'utf8'));
  const result = await runPasswordGate(homeHtml, { submittedPassword: 'wrong-password' });

  assert.equal(result.preventedSubmit, true, 'password form should not perform a page submit');
  assert.equal(result.isUnlocked, false, 'wrong password must not unlock the page');
  assert.equal(result.storedAuth, undefined, 'wrong password must not be saved as authenticated');
  assert.equal(result.errorHidden, false, 'wrong password should reveal the error message');
  assert.equal(result.inputValue, '', 'wrong password should clear the input');
  assert.equal(result.inputFocused, true, 'wrong password should focus the input again');
});

test('correct password unlocks every built page', {
  skip: !distExists && 'Run pnpm build first',
}, async () => {
  const htmlFiles = builtHtmlFiles();

  for (const filePath of htmlFiles) {
    const html = withTestPasswordHash(readFileSync(filePath, 'utf8'));
    const result = await runPasswordGate(html, { submittedPassword: testPassword });

    assert.equal(result.preventedSubmit, true, `${relative(filePath)} form should not perform a page submit`);
    assert.equal(result.isUnlocked, true, `${relative(filePath)} should unlock with the correct password`);
    assert.equal(result.storedAuth, 'ok', `${relative(filePath)} should remember authentication`);
    assert.equal(result.errorHidden, true, `${relative(filePath)} should keep the error hidden`);
  }
});

test('saved authentication unlocks every built page without asking again', {
  skip: !distExists && 'Run pnpm build first',
}, async () => {
  const htmlFiles = builtHtmlFiles();

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, 'utf8');
    const result = await runPasswordGate(html, { storedAuth: 'ok' });

    assert.equal(result.isUnlocked, true, `${relative(filePath)} should unlock from saved authentication`);
  }
});

function builtHtmlFiles() {
  return walkFiles(distDir, (filePath) => filePath.endsWith('.html'));
}

function withTestPasswordHash(html) {
  return html.replace(/data-password-hash(?:="[^"]*")?/, `data-password-hash="${testPasswordHash}"`);
}

async function runPasswordGate(html, { submittedPassword, storedAuth } = {}) {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .filter((script) => script.includes('app-hub-auth') || script.includes('sha256'));

  assert.ok(scripts.length >= 2, 'built page must include password gate scripts');

  let preventedSubmit = false;
  let inputFocused = false;
  let submitHandler;
  const classes = new Set();
  const storage = new Map(storedAuth ? [['app-hub-auth', storedAuth]] : []);
  const passwordHash = readPasswordHash(html);

  class HTMLElement {}
  class HTMLFormElement extends HTMLElement {
    dataset = { passwordHash };
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
          contains(value) {
            return classes.has(value);
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
    storedAuth: storage.get('app-hub-auth'),
  };
}

function readPasswordHash(html) {
  const match = html.match(/data-password-hash(?:="([^"]*)")?/);
  return match?.[1] ?? '';
}
