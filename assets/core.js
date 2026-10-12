export const CONTACT = '77753715077';
export function estimateSavings(vehicles, fuelBudget, rate) {
  const n = Number(vehicles), budget = Number(fuelBudget), percent = Number(rate);
  if (vehicles === '' || fuelBudget === '' || rate === '' || !Number.isInteger(n) || n < 1 || n > 200 ||
      !Number.isFinite(budget) || budget < 0 || budget > 10000000 || ![5, 10, 15].includes(percent)) return null;
  const monthly = Math.round(n * budget * percent / 100);
  return { vehicles: n, fuelBudget: budget, rate: percent, monthly, annual: monthly * 12 };
}
export function formatMoney(value) {
  return new Intl.NumberFormat('ru-KZ', { maximumFractionDigits: 0 }).format(value) + ' ₸';
}
export function composeMessage({ name, fleet, city, solution, comment, estimate }) {
  const lines = ['Здравствуйте! Хочу подобрать решение Glonass Navi.', '',
    'Имя: ' + name.trim(), 'Город: ' + city.trim(), 'Машин: ' + fleet, 'Интересует: ' + solution];
  if (comment.trim()) lines.push('Задача: ' + comment.trim());
  if (estimate && Number(fleet) === estimate.vehicles) {
    lines.push('', 'Сценарий калькулятора (не прогноз):',
      estimate.vehicles + ' машин × ' + formatMoney(estimate.fuelBudget) + ' на машину/месяц × ' + estimate.rate + '%',
      'Возможное снижение расходов до затрат на систему: ' + formatMoney(estimate.monthly) + ' в месяц.');
  }
  return lines.join('\n');
}
export function whatsappUrl(message) {
  return 'https://wa.me/' + CONTACT + '?text=' + encodeURIComponent(message);
}
