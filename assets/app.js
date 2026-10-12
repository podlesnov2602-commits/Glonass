import { estimateSavings, formatMoney, composeMessage, whatsappUrl } from './core.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const menu = $('.menu-toggle');
const navigation = $('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Открыть меню');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.header')) closeMenu();
});
window.matchMedia('(min-width: 951px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

function wireTabs(buttons, activate, vertical = false) {
  const choose = (button, focus = false) => {
    buttons.forEach((item) => {
      const selected = item === button;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    activate(button);
    if (focus) button.focus();
  };
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => choose(button));
    button.addEventListener('keydown', (event) => {
      const forward = vertical ? 'ArrowDown' : 'ArrowRight';
      const backward = vertical ? 'ArrowUp' : 'ArrowLeft';
      let next;
      if (event.key === forward) next = (index + 1) % buttons.length;
      if (event.key === backward) next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        choose(buttons[next], true);
      }
    });
  });
}
wireTabs($$('[data-demo]'), (button) => {
  $$('.demo-panel').forEach((panel) => { panel.hidden = panel.id !== 'panel-' + button.dataset.demo; });
});

const industries = {
  logistics: {
    tag: 'От городского фургона до тягача', title: ['Рейс по плану.', 'Клиент в курсе.'],
    description: 'Проверяйте фактические маршруты, время прибытия и остановки. Разбирайте спорные рейсы по истории поездок.',
    points: ['Местоположение и история движения', 'Въезд и выезд из геозон клиентов', 'Пробег, стоянки и расход топлива'],
    cta: 'Подобрать для логистики', label: 'Логистика и доставка'
  },
  construction: {
    tag: 'Самосвалы, экскаваторы, спецтехника', title: ['Техника работает.', 'Вы видите результат.'],
    description: 'Отслеживайте работу на объектах и перемещения между площадками. Проверяйте время работы двигателя и использование топлива.',
    points: ['Моточасы при совместимом подключении', 'Контроль границ строительной площадки', 'Заправки и расход с датчиком топлива'],
    cta: 'Подобрать для стройки', label: 'Строительство'
  },
  agriculture: {
    tag: 'Тракторы, комбайны и полевые работы', title: ['В поле — техника.', 'В системе — порядок.'],
    description: 'Сопоставляйте маршруты сельхозтехники, время работы и расход топлива. Проверяйте перемещения между участками и базой.',
    points: ['История передвижений по участкам', 'Моточасы и простои при нужной настройке', 'Контроль заправок при установленном ДУТ'],
    cta: 'Подобрать для хозяйства', label: 'Сельское хозяйство'
  },
  passenger: {
    tag: 'Автобусы и корпоративные перевозки', title: ['Маршрут известен.', 'Движение прозрачно.'],
    description: 'Контролируйте прохождение маршрута, остановки и скоростной режим. Используйте историю рейсов для проверки обращений.',
    points: ['Контроль движения по маршруту', 'Уведомления о превышении скорости', 'Геозоны остановок и точек прибытия'],
    cta: 'Подобрать для перевозок', label: 'Пассажирский транспорт'
  }
};
let selectedIndustry = null;
wireTabs($$('[data-industry]'), (button) => {
  const data = industries[button.dataset.industry];
  selectedIndustry = data.label;
  $('#industry-panel').setAttribute('aria-labelledby', button.id);
  $('#industry-tag').textContent = data.tag;
  $('#industry-title').replaceChildren(document.createTextNode(data.title[0]), document.createElement('br'), document.createTextNode(data.title[1]));
  $('#industry-description').textContent = data.description;
  $('#industry-list').replaceChildren(...data.points.map((text) => {
    const li = document.createElement('li'); li.textContent = text; return li;
  }));
  $('#industry-cta').firstChild.textContent = data.cta + ' ';
}, true);
$('#industry-cta').addEventListener('click', () => {
  $('#lead-solution').value = 'Индивидуальное решение';
  if (!$('#lead-comment').value.trim()) $('#lead-comment').value = 'Отрасль: ' + (selectedIndustry || industries.logistics.label);
});

let latestEstimate = null;
let includeEstimate = false;
function updateCalculator() {
  const vehicles = $('#vehicles').value;
  $('#vehicles-value').textContent = vehicles;
  latestEstimate = estimateSavings(vehicles, $('#fuel-budget').value, $('[name="saving-rate"]:checked').value);
  if (!latestEstimate) {
    $('#monthly-saving').textContent = '—';
    $('#annual-saving').textContent = '—';
    $('#calc-formula').textContent = 'Введите расходы от 0 до 10 000 000 ₸.';
    return;
  }
  $('#monthly-saving').textContent = formatMoney(latestEstimate.monthly);
  $('#annual-saving').textContent = formatMoney(latestEstimate.annual);
  $('#calc-formula').textContent = latestEstimate.vehicles + ' машин × ' + formatMoney(latestEstimate.fuelBudget) + ' × ' + latestEstimate.rate + '%';
}
$('#calculator-form').addEventListener('input', updateCalculator);
$('#calculator-form').addEventListener('submit', (event) => event.preventDefault());
$('#calculator-cta').addEventListener('click', () => {
  includeEstimate = Boolean(latestEstimate);
  if (latestEstimate) {
    $('#lead-fleet').value = latestEstimate.vehicles;
    $('#lead-solution').value = 'GPS + контроль топлива';
  }
});
$$('[data-solution]').forEach((link) => link.addEventListener('click', () => {
  $('#lead-solution').value = link.dataset.solution;
}));

const leadForm = $('#lead-form');
leadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!leadForm.reportValidity()) return;
  const data = new FormData(leadForm);
  const name = String(data.get('name') || '').trim();
  const city = String(data.get('city') || '').trim();
  const status = $('#lead-status');
  if (!name || !city) {
    status.hidden = false;
    status.textContent = 'Укажите имя и город: одних пробелов недостаточно.';
    (!name ? $('#lead-name') : $('#lead-city')).focus();
    return;
  }
  const message = composeMessage({
    name, city, fleet: data.get('fleet'), solution: String(data.get('solution')),
    comment: String(data.get('comment') || ''), estimate: includeEstimate ? latestEstimate : null
  });
  status.hidden = false;
  status.textContent = 'Текст подготовлен. В WhatsApp проверьте его и нажмите «Отправить».';
  window.location.assign(whatsappUrl(message));
});
updateCalculator();
