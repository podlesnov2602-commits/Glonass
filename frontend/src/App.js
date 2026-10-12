import React from 'react';
import {
  Activity, Bell, Boxes, Battery, CircleCheck, Container, DoorOpen, Droplets, Eye, Fuel,
  Gauge, IdCard, LocateFixed, Map, Satellite, ShieldCheck,
  Smartphone, Thermometer, Truck, Video, Weight, WalletCards, Wrench, TrendingDown, Clock3
} from 'lucide-react';
import './App.css';

const industries = [
  ['🚚','Логистика','Контроль доставки · ETA · Маршруты'],['🏗','Строительство','Экскаваторы · Самосвалы · Моточасы'],
  ['🚍','Пассажирские перевозки','Автобусы · Маршрутки · Школьный транспорт'],['🚜','Сельское хозяйство','Комбайны · Тракторы · Посев · Уборка'],
  ['🚛','Международные перевозки','Температура · Маршруты · Стоянки'],['🚓','Охранные компании','Группы реагирования · Время прибытия'],
  ['🚑','Медицина','Скорая помощь · Медицинские автомобили'],['🏭','Производство','Служебный транспорт'],
  ['🚖','Такси','Контроль смен и качества вождения'],['🚧','Дорожные службы','Спецтехника и выездные бригады'],
  ['📦','Курьерские службы','Доставка и контроль SLA'],['🛢','Нефтегаз','Цистерны · Топливо · Безопасность']
];
const losses = [['🚛','Неучтённые рейсы'],['⛽','Воровство топлива'],['⏳','Простои техники'],['🚦','Превышение скорости'],['👷','Личные поездки'],['📉','Отсутствие аналитики']];
const controls = [
  ['GPS', LocateFixed], ['GLONASS', Satellite], ['Топливо', Fuel], ['CAN', Activity],
  ['OBD', Gauge], ['Температура', Thermometer], ['Влажность', Droplets], ['Вес', Weight],
  ['Прицеп', Container], ['Видео', Video], ['ADAS', Eye], ['DMS', ShieldCheck],
  ['Тахограф', IdCard], ['Моточасы', Activity], ['Геозоны', Map], ['АКБ', Battery],
  ['Двери', DoorOpen], ['RFID', IdCard]
];
const features = ['Онлайн карта','Все автомобили','Время работы','Расход топлива','Маршруты','Геозоны','История движения','Отчеты','Push уведомления','Мобильное приложение'];

function Title({eyebrow, children, text}) { return <div className="title"><span>{eyebrow}</span><h2>{children}</h2>{text && <p>{text}</p>}</div> }
function CheckList({items}) { return <div className="checks">{items.map(x=><div key={x}><CircleCheck size={18}/>{x}</div>)}</div> }
function MapVisual(){return <div className="mapvisual"><div className="map-grid"/><svg viewBox="0 0 700 370" preserveAspectRatio="none"><path d="M0 280 C100 240 90 80 220 120 S350 330 460 220 S570 70 700 120"/><path className="route2" d="M0 100 C160 200 220 20 360 130 S550 330 700 220"/></svg>{[[18,68],[31,33],[51,55],[67,27],[81,58]].map((p,i)=><i key={i} style={{left:p[0]+'%',top:p[1]+'%'}}><Truck size={15}/></i>)}<div className="map-pill"><span className="pulse"/> 24 объекта онлайн</div></div>}
function FleetDashboard(){
 const vehicles = [[12,22,'Тягач 014'],[18,62,'Газель 031'],[25,38,'Кран 008'],[31,74,'Самосвал 119'],[37,18,'Реф 044'],[44,52,'Автобус 217'],[51,29,'Пикап 066'],[58,69,'Фура 101'],[64,42,'Погрузчик 73'],[70,21,'Курьер 15'],[76,55,'Цистерна 09'],[83,34,'Трал 27'],[88,73,'Сервис 04']];
 return <div className="fleet-dashboard"><div className="fleet-top"><b>Fleet Management Dashboard</b><span>Live monitoring · 132 assets</span></div><div className="fleet-layout"><aside><strong>Техника</strong>{['КамАЗ 5490','DAF XF','Hyundai HD','MAN TGX','Isuzu NQR'].map((x,i)=><div className={i===1?'selected':''} key={x}><Truck size={14}/><span>{x}</span><small>{i===1?'в рейсе':'онлайн'}</small></div>)}</aside><div className="fleet-map"><div className="map-grid"/><svg viewBox="0 0 900 520" preserveAspectRatio="none"><path d="M20 390 C160 270 210 420 350 260 S570 120 870 210"/><path className="route2" d="M40 120 C190 210 290 80 450 170 S650 390 860 330"/><path className="route3" d="M120 470 C260 350 430 430 510 300 S690 110 820 90"/></svg><div className="geofence g1">Геозона A</div><div className="geofence g2">Склад</div>{vehicles.map((v,i)=><i key={v[2]} style={{left:v[0]+'%',top:v[1]+'%'}} title={v[2]}><Truck size={12}/></i>)}<div className="history-card"><b>История движения</b><span>08:10 база → 11:45 клиент → 14:20 склад</span></div></div><section><div><b>128</b><small>онлайн</small></div><div><b>42</b><small>в геозонах</small></div><div><b>17</b><small>отклонений</small></div></section></div></div>
}
function Chart({fuel=false}){return <div className={'chart '+(fuel?'fuel-chart':'')}><div className="chart-top"><span>{fuel?'Расход топлива':'Эффективность автопарка'}</span><b>{fuel?'1 248 л':'92%'}</b></div><div className="bars">{[40,65,48,82,55,91,70,95,76,88,62,93].map((h,i)=><i key={i} style={{height:h+'%'}}/>)}</div><small>Данные обновлены только что</small></div>}

function App() {
 return <main>
  <section className="hero" id="top"><div className="orb o1"/><div className="orb o2"/><div className="hero-copy"><div className="tag"><i/> Спутниковый контроль нового поколения</div><h1>Ваш автопарк.<br/><span>Под полным контролем.</span></h1><p>Комплексные решения GPS/ГЛОНАСС мониторинга транспорта для прозрачного и эффективного бизнеса.</p><div className="hero-points"><b>Контроль транспорта.</b><b>Контроль топлива.</b><b>Контроль сотрудников.</b><b>Полная цифровизация.</b></div></div><div className="hero-stage"><div className="radar"><div/><i/><i/><i/><span><Truck/></span></div><div className="floating f1"><small>Экономия топлива</small><b>−27.4%</b></div><div className="floating f2"><small>Транспорт онлайн</small><b>128 <em>/ 132</em></b></div><div className="floating f3"><Activity/><span><small>Статус системы</small><b>Все работает</b></span></div></div></section>

  <section id="losses" className="section dark"><Title eyebrow="Цена отсутствия контроля" text="Потери, которые можно превратить в прибыль">Почему компании теряют деньги</Title><div className="loss-grid">{losses.map((x,i)=><div className="loss" key={x[1]}><span>{x[0]}</span><b>{x[1]}</b><small>0{i+1}</small></div>)}</div><p className="note">По данным отрасли внедрение GPS-мониторинга позволяет сократить расход топлива, уменьшить простои и повысить прозрачность эксплуатации транспорта за счет контроля маршрутов, поведения водителей и технических параметров.</p></section>

  <section id="platform" className="section"><Title eyebrow="Единый центр управления">Что получает руководитель</Title><div className="dashboard"><div className="dash-head"><b>GLONASS NAVI / Live</b><span>● Система работает</span></div><div className="dash-body"><aside>{['Обзор','Транспорт','Маршруты','Топливо','Отчеты'].map((x,i)=><div className={i===0?'active':''} key={x}>{x}</div>)}</aside><MapVisual/><div className="dash-stats"><b>132</b><small>всего объектов</small><hr/><b>128</b><small>сейчас в движении</small><hr/><b>98%</b><small>уровень связи</small></div></div></div><CheckList items={features}/></section>

  <section id="solutions" className="section navy"><Title eyebrow="Для любого масштаба бизнеса">Отраслевые решения</Title><div className="industry-grid">{industries.map(x=><article key={x[1]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></section>

  <section className="section"><Title eyebrow="Телематика без ограничений">Что можно контролировать</Title><div className="control-grid">{controls.map(([name, Icon])=><div key={name}><Icon size={24}/><b>{name}</b></div>)}</div></section>

  <section className="section split"><div><Title eyebrow="Транспорт на ладони">GPS мониторинг</Title><p className="lead">Профессиональная панель мониторинга показывает большую карту, маршруты, геозоны, карточки техники и историю движения по каждому активу.</p><CheckList items={['Большая live-карта','Десятки автомобилей','Маршруты и треки','Геозоны','Карточки техники','История движения']}/></div><FleetDashboard/></section>

  <section className="section fuel"><div className="fuel-art"><div className="tank"><Fuel/><strong>74%</strong><span>280 л</span></div><Chart fuel/></div><div><Title eyebrow="Самый быстрый возврат инвестиций">Контроль топлива</Title><p className="lead">Датчики высокой точности фиксируют каждую заправку и мгновенно определяют подозрительный слив.</p><CheckList items={['Заправки и сливы','Фактический расход','Остаток в баке','Средний расход','Отклонения от нормы']}/><div className="alert"><Bell/> Обнаружен слив: −42 л <small>12:48 · КамАЗ 5490</small></div></div></section>

  <section className="section navy"><Title eyebrow="Безопасность в кадре">Видео мониторинг</Title><div className="video-grid"><div className="camera maincam"><div className="road"><div/><span>CAM 01 • LIVE</span></div></div>{['Салон водителя','Задняя камера','Грузовой отсек'].map((x,i)=><div className="camera" key={x}><Video/><b>{x}</b><small>CAM 0{i+2} • LIVE</small></div>)}</div><div className="mini-features"><b>ADAS</b><b>DMS</b><b>Запись</b><b>Онлайн просмотр</b><b>Архив</b></div></section>

  <section className="section"><Title eyebrow="Ответственное вождение">Контроль водителей</Title><div className="driver"><div className="score"><small>Средний рейтинг парка</small><strong>8.7</strong><span>/ 10</span><div>↑ 12% за этот месяц</div></div><Chart/><CheckList items={['Нарушения','Резкие торможения','Разгоны','Превышение скорости','Холостой ход']}/></div></section>

  <section className="section compact navy"><Title eyebrow="Специализированные сценарии">Контроль каждого актива</Title><div className="scenario-grid">{[['Выездные сотрудники','Курьеры · Монтажники · Инженеры · Торговые представители','👷'],['Спецтехника','Экскаваторы · Автокраны · Погрузчики · Бульдозеры','🏗'],['Автобусы','Расписание · Остановки · Маршруты · Опоздания','🚌'],['Рефрижераторы','Температура · Открытие дверей · Оповещения','❄️'],['Прицепы','Местоположение и сцепка','🚛'],['Контейнеры','Перемещения и простои','📦'],['Генераторы','Моточасы и топливо','⚡'],['Цистерны','Объем и безопасность','🛢']].map(x=><article key={x[0]}><span>{x[2]}</span><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div></section>

  <section className="section split"><div><Title eyebrow="Умные территории">Геозоны</Title><p className="lead">Создавайте зоны любой формы. Получайте событие в момент въезда, выезда или долгой остановки.</p><div className="notify"><b><Bell/> Мгновенные уведомления</b><span>Push</span><span>SMS</span><span>Telegram</span><span>Email</span></div></div><MapVisual/></section>

  <section className="section"><Title eyebrow="Данные становятся решениями">Отчеты и аналитика</Title><div className="analytics"><div><span>Более</span><strong>50</strong><b>видов отчетов</b><p>От топлива до эффективности сотрудников. Настраивайте и выгружайте в один клик.</p></div><Chart/><Chart fuel/></div></section>

  <section className="section navy app-section"><div><Title eyebrow="Офис всегда с вами">Мобильное приложение</Title><p className="lead">Контроль автопарка из любой точки мира. Все ключевые показатели, карта и уведомления в вашем смартфоне.</p><div className="store"><span>App Store</span><span>Google Play</span></div></div><div className="phone"><div className="phone-head">GLONASS NAVI <span>•••</span></div><MapVisual/><div className="phone-stat"><b>24 в движении</b><span>3 на стоянке</span></div></div></section>

  <section className="section"><Title eyebrow="Встраивается в ваш бизнес">Интеграции</Title><div className="integrations">{['1С','CRM','ERP','API','Excel'].map(x=><div key={x}>{x}</div>)}</div><div className="how"><Satellite/><i>→</i><div><LocateFixed/><span>GPS трекер</span></div><i>→</i><div><Activity/><span>SIM</span></div><i>→</i><div><Boxes/><span>Сервер</span></div><i>→</i><div><Map/><span>Платформа</span></div><i>→</i><Smartphone/></div></section>


  <section className="section rental-section"><div><Title eyebrow="Быстрый старт без покупки">Аренда оборудования вместо лишних затрат</Title><p className="lead">Предоставляем GPS/ГЛОНАСС-трекеры, датчики топлива, видеомодули и другое телематическое оборудование в аренду. Вы запускаете мониторинг без крупных первоначальных вложений, а мы берем на себя подбор, установку, настройку и техническое сопровождение.</p><CheckList items={['Не нужно замораживать бюджет в покупке оборудования','Платите за решение, которое уже работает на ваш бизнес','Можно быстро масштабировать парк под сезонные задачи','Обслуживание и поддержка включены в сопровождение']}/></div><div className="rental-card"><div className="rental-card-top"><span>Аренда</span><b>выгоднее покупки</b></div><div className="rental-benefits">{[[WalletCards,'Меньше стартовые расходы','Запуск без капитальных затрат на весь парк'],[Wrench,'Сервис под ключ','Монтаж, настройка и помощь специалистов'],[TrendingDown,'Ниже финансовые риски','Не покупаете лишнее оборудование заранее'],[Clock3,'Быстрое масштабирование','Добавляйте или убирайте устройства по потребности']].map(([Icon,title,text])=><article key={title}><Icon size={22}/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

  <section className="section navy"><Title eyebrow="От идеи до результата">Этапы внедрения</Title><div className="steps">{['Анализ','Подбор оборудования','Монтаж','Настройка','Обучение','Поддержка'].map((x,i)=><div key={x}><span>0{i+1}</span><b>{x}</b></div>)}</div></section>

  <section id="benefits" className="section"><Title eyebrow="Измеримый результат">Экономический эффект</Title><div className="economy">{[['30%','экономии топлива'],['40%','снижения нецелевых поездок'],['25%','снижения простоев'],['50%','ускорения поиска транспорта']].map((x)=><div key={x[1]} style={{'--p':x[0]}}><strong>До {x[0]}</strong><span>{x[1]}</span></div>)}</div><p className="note">Показатели зависят от специфики бизнеса и дисциплины эксплуатации, но именно такие категории эффектов чаще всего достигаются при внедрении современных систем телематики.</p></section>

  <section className="section why navy"><div><Title eyebrow="Ваш надежный партнер">Почему GLONASS NAVI</Title><CheckList items={['Более 10 лет опыта','Монтаж и поддержка','Обучение команды','Гарантия','Современная платформа','Мобильное приложение','Работаем по Казахстану']}/></div><div className="big-number"><span>10+</span><b>лет создаем<br/>технологии контроля</b></div></section>

  <section className="section"><Title eyebrow="Нам доверяют">Наши клиенты</Title><div className="logos client-logos">{['Alfa Lombard','ТОО ГШ','VECTOR 7','BARON','K-S','ОМИССО','Clean House'].map((x,i)=><b className={`client-logo logo-${i}`} key={x}>{x}</b>)}</div></section>

  <section id="contacts" className="final"><div><span className="tag">Корпоративная презентация</span><h2>Автопарк<br/><em>под полным контролем.</em></h2><p className="contact-phone">Телефон для связи: <a href="tel:+77760691140">+7 776 069 11 40</a></p></div><div className="contact-card"><b>GLONASS NAVI</b><span>GPS/ГЛОНАСС мониторинг транспорта</span><p>Казахстан · Fleet Management · Telematics</p></div></section>
  <footer><p>GPS/ГЛОНАСС мониторинг транспорта · Казахстан</p><p>© 2026 GLONASS NAVI</p></footer>
 </main>
}
export default App;
