import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateSavings, formatMoney, composeMessage, whatsappUrl } from '../assets/core.js';

test('default scenario and annual estimate use gross fuel savings', () => {
  assert.deepEqual(estimateSavings(10, 150000, 10), { vehicles: 10, fuelBudget: 150000, rate: 10, monthly: 150000, annual: 1800000 });
});
test('zero, minimum and maximum fleet scenarios', () => {
  assert.equal(estimateSavings(1, 0, 5).monthly, 0);
  assert.equal(estimateSavings(1, 1000, 5).annual, 600);
  assert.equal(estimateSavings(200, 10000000, 15).monthly, 300000000);
});
test('reject invalid and unsupported input rather than showing a misleading estimate', () => {
  for (const args of [[0,150000,10], [201,150000,10], [1.5,1000,5], [10,-1,10], [10,Infinity,10], [10,10000001,10], [10,'',10], [10,'abc',10], [10,1000,99], ['',1000,5]]) {
    assert.equal(estimateSavings(...args), null, JSON.stringify(args));
  }
});
test('message encoding round-trips Cyrillic and URL special characters', () => {
  const message = composeMessage({ name: '  Анна & Co  ', fleet: '10', city: 'Алматы', solution: 'GPS + контроль топлива', comment: 'Рейс №1? 50% & склад', estimate: estimateSavings(10,150000,10) });
  const url = new URL(whatsappUrl(message));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/77753715077');
  assert.equal(url.searchParams.get('text'), message);
  assert.match(message, /Анна & Co/);
  assert.match(message, /не прогноз/);
  assert.match(message, /150/);
});
test('do not include a stale calculator estimate if fleet count was changed in the form', () => {
  const message = composeMessage({ name: 'Иван', city: 'Алматы', fleet: 15, solution: 'GPS', comment: '', estimate: estimateSavings(10,150000,10) });
  assert.doesNotMatch(message, /Сценарий/);
  assert.doesNotMatch(message, /Задача:/);
});
test('currency is KZT', () => { assert.match(formatMoney(150000), /₸$/); });
