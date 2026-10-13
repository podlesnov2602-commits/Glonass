// Motion, rental configurator and floating contact. No external runtime dependencies.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
let userPaused = false;
let frame = 0;
const progress = document.querySelector('.scroll-progress');
const scene = document.querySelector('.hero-visual');
const motionButton = document.querySelector('.motion-toggle');

class NaviContact extends HTMLElement {
  connectedCallback() { this.setAttribute('aria-label', 'Быстрая связь'); }
}
if (!customElements.get('navi-contact')) customElements.define('navi-contact', NaviContact);

function motionDisabled() { return reduced.matches || userPaused; }
function renderScroll() {
  frame = 0;
  const maximum = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = 'scaleX(' + (maximum > 0 ? Math.min(1, window.scrollY / maximum) : 0) + ')';
  if (scene) {
    const amount = motionDisabled() ? 0 : Math.min(1, window.scrollY / 650);
    scene.style.setProperty('--scene-scale', String(0.96 + amount * 0.04));
    scene.style.setProperty('--scene-angle', (3 - amount * 3) + 'deg');
  }
}
function requestScroll() { if (!frame) frame = requestAnimationFrame(renderScroll); }
function syncMotion() {
  root.classList.toggle('motion-paused', motionDisabled());
  motionButton.setAttribute('aria-pressed', String(userPaused));
  motionButton.setAttribute('aria-label', userPaused ? 'Включить анимацию' : 'Остановить анимацию');
  motionButton.textContent = userPaused ? 'Включить анимацию' : 'Пауза анимации';
  motionButton.hidden = reduced.matches;
  renderScroll();
}
motionButton.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
reduced.addEventListener('change', syncMotion);
window.addEventListener('scroll', requestScroll, { passive: true });
window.addEventListener('resize', requestScroll, { passive: true });
syncMotion();

if ('IntersectionObserver' in window && !reduced.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading,.feature-card,.rental-heading,.rental-product,.clients-heading,.client-logo,.industry-layout,.fuel-report,.calculator,.package,.process-list article,.guide-card,.proposal-copy').forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', (index % 3) * 65 + 'ms');
    observer.observe(element);
  });
}

const configurations = {
  rent: {
    kicker: 'БЕЗ ПОКУПКИ ОБОРУДОВАНИЯ', title: ['Пользуйтесь.', 'Не покупайте.'],
    description: 'Подходящий вариант, если вы хотите подключить мониторинг и взять оборудование в аренду.',
    points: ['Не нужно покупать GPS-трекеры', 'Подбор комплекта под вашу технику', 'Монтаж и настройка по согласованным условиям'],
    cta: 'Рассчитать аренду', solution: 'Аренда оборудования',
    note: 'Стоимость аренды, монтажа, обслуживания, срок и условия возврата фиксируются в предложении и договоре.'
  },
  buy: {
    kicker: 'ОБОРУДОВАНИЕ В СОБСТВЕННОСТЬ', title: ['Ваш комплект.', 'Ваш выбор.'],
    description: 'Подходящий вариант, если вы предпочитаете приобрести оборудование для своего автопарка.',
    points: ['Подбор совместимых трекеров и датчиков', 'Оборудование приобретается отдельно', 'Установка и обслуживание по предложению'],
    cta: 'Рассчитать покупку', solution: 'GPS-мониторинг',
    note: 'Стоимость оборудования, установки и регулярного обслуживания рассчитывается отдельно под вашу задачу.'
  }
};
const buttons = [...document.querySelectorAll('[data-ownership]')];
function selectOwnership(button, focus = false) {
  const config = configurations[button.dataset.ownership];
  buttons.forEach(item => { const active = item === button; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; });
  document.querySelector('#ownership-panel').setAttribute('aria-labelledby', button.id);
  document.querySelector('#ownership-kicker').textContent = config.kicker;
  document.querySelector('#ownership-title').replaceChildren(document.createTextNode(config.title[0]), document.createElement('br'), document.createTextNode(config.title[1]));
  document.querySelector('#ownership-description').textContent = config.description;
  document.querySelector('#ownership-points').replaceChildren(...config.points.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  const cta = document.querySelector('#ownership-cta');
  cta.firstChild.textContent = config.cta + ' ';
  cta.dataset.solution = config.solution;
  document.querySelector('#ownership-note').textContent = config.note;
  if (focus) button.focus();
}
buttons.forEach((button, index) => {
  button.addEventListener('click', () => selectOwnership(button));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - index;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = 1;
    if (next !== undefined) { event.preventDefault(); selectOwnership(buttons[next], true); }
  });
});
document.querySelectorAll('.client-logo img').forEach(image => {
  function recover() {
    if (!image.dataset.fallbackTried) {
      image.dataset.fallbackTried = 'true';
      image.src = image.dataset.clientSource;
    } else {
      const label = document.createElement('span');
      label.textContent = 'Клиент Glonass Navi';
      image.replaceWith(label);
    }
  }
  image.addEventListener('error', recover);
  if (image.complete && image.naturalWidth === 0) recover();
});
