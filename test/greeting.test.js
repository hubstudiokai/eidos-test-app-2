import assert from 'node:assert/strict';
import { test } from 'node:test';

import { greeting, MAX_NAME_LENGTH } from '../src/greeting.js';

test('greets a name', () => {
  assert.equal(greeting('Ada'), 'Bienvenue à tous, Ada !');
});

test('greets the world without a name, or with a blank one', () => {
  assert.equal(greeting(undefined), 'Bienvenue à tous !');
  assert.equal(greeting(null), 'Bienvenue à tous !');
  assert.equal(greeting('   '), 'Bienvenue à tous !');
});

test('trims a name and cuts it to its longest length', () => {
  assert.equal(greeting('  Ada  '), 'Bienvenue à tous, Ada !');
  assert.equal(greeting('a'.repeat(MAX_NAME_LENGTH + 5)), `Bienvenue à tous, ${'a'.repeat(MAX_NAME_LENGTH)} !`);
});
