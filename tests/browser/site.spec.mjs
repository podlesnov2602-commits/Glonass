import { test, expect } from '@playwright/test';

test('home, responsive layout and screenshots', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Весь автопарк');
  await expect(page.locator('#monthly-saving')).toContainText('150');
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.setViewportSize(testInfo.project.use.viewport || { width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.screenshot({ path: testInfo.outputPath('homepage.png'), fullPage: true });
  await testInfo.attach('Homepage', { path: testInfo.outputPath('homepage.png'), contentType: 'image/png' });
  expect(errors).toEqual([]);
});

test('demo tabs, keyboard navigation and industry selection', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Топливо', exact: true }).click();
  await expect(page.locator('#panel-fuel')).toBeVisible();
  await expect(page.locator('#panel-route')).toBeHidden();
  await page.getByRole('tab', { name: 'Топливо', exact: true }).press('ArrowRight');
  await expect(page.locator('#tab-events')).toBeFocused();
  await expect(page.locator('#panel-events')).toBeVisible();
  await page.getByRole('tab', { name: /Строительство/ }).click();
  await expect(page.locator('#industry-title')).toContainText('Техника работает');
  await page.locator('#industry-cta').click();
  await expect(page.locator('#lead-solution')).toHaveValue('Индивидуальное решение');
  await expect(page.locator('#lead-comment')).toHaveValue('Отрасль: Строительство');
});

test('calculator updates, boundary validation and form handoff', async ({ page }) => {
  await page.goto('/');
  await page.locator('#vehicles').fill('20');
  await page.locator('#fuel-budget').fill('200000');
  await page.locator('input[name="saving-rate"][value="15"]').check();
  await expect(page.locator('#monthly-saving')).toHaveText(/600\s000\s₸/);
  await expect(page.locator('#annual-saving')).toHaveText(/7\s200\s000\s₸/);
  await page.locator('#calculator-cta').click();
  await expect(page.locator('#lead-fleet')).toHaveValue('20');
  await expect(page.locator('#lead-solution')).toHaveValue('GPS + контроль топлива');
  await page.locator('#fuel-budget').fill('-1');
  await expect(page.locator('#monthly-saving')).toHaveText('—');
  await page.locator('#fuel-budget').fill('0');
  await expect(page.locator('#monthly-saving')).toHaveText('0 ₸');
});

test('lead form requires consent and hands a correctly encoded draft to WhatsApp', async ({ page }) => {
  let destination;
  await page.route('https://wa.me/**', async route => {
    destination = route.request().url();
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Test-only WhatsApp handoff. No message sent.</p>' });
  });
  await page.goto('/');
  await page.locator('#lead-name').fill('Анна & Co');
  await page.locator('#lead-city').fill('Алматы');
  await page.locator('#lead-comment').fill('10 грузовиков, ДУТ & CAN?');
  await page.getByRole('button', { name: 'Продолжить в WhatsApp' }).click();
  expect(destination).toBeUndefined();
  await page.locator('input[name="consent"]').check();
  await Promise.all([
    page.waitForURL('https://wa.me/**'),
    page.getByRole('button', { name: 'Продолжить в WhatsApp' }).click()
  ]);
  const url = new URL(destination);
  expect(url.pathname).toBe('/77753715077');
  const text = url.searchParams.get('text');
  expect(text).toContain('Анна & Co');
  expect(text).toContain('Алматы');
  expect(text).toContain('ДУТ & CAN?');
});

test('menu and FAQ remain keyboard accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await expect(page.locator('#navigation')).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть меню' }).press('Escape');
  await expect(page.locator('#navigation')).toBeHidden();
  await page.locator('summary').first().click();
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
});

test('guides and contact paths work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Продолжить в WhatsApp' })).toBeDisabled();
  await expect(page.locator('a[href="tel:+77753715077"]').first()).toHaveAttribute('href', 'tel:+77753715077');
  for (const slug of ['gps-monitoring', 'fuel-control', 'choose-tracker']) {
    await page.goto('http://127.0.0.1:4173/guides/' + slug + '.html');
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.locator('.source-list a').count()).toBeGreaterThan(0);
  }
  await context.close();
});

test('rental selection passes the chosen ownership model to the enquiry', async ({ page }) => {
  await page.goto('/');
  await page.locator('#ownership-buy').click();
  await expect(page.locator('#ownership-title')).toContainText('Ваш комплект');
  await page.locator('#ownership-cta').click();
  await expect(page.locator('#lead-solution')).toHaveValue('GPS-мониторинг');
  await page.locator('#ownership-rent').click();
  await page.locator('#ownership-cta').click();
  await expect(page.locator('#lead-solution')).toHaveValue('Аренда оборудования');
});

test('floating WhatsApp stays on screen and avoids the mobile action bar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const selector of ['#rental', '#calculator', '#contacts']) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    const bubble = await page.locator('.whatsapp-float').boundingBox();
    const bar = await page.locator('.mobile-cta').boundingBox();
    expect(bubble.x).toBeGreaterThanOrEqual(0);
    expect(bubble.x + bubble.width).toBeLessThanOrEqual(390);
    expect(bubble.y).toBeGreaterThanOrEqual(0);
    expect(bubble.y + bubble.height).toBeLessThan(bar.y);
  }
  await expect(page.locator('.whatsapp-float')).toHaveAttribute('href', 'https://wa.me/77753715077');
});

test('verified client images load from repository and motion respects preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#clients').scrollIntoViewIfNeeded();
  await expect(page.locator('.client-logo img')).toHaveCount(7);
  await expect.poll(() => page.locator('.client-logo img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  await expect(page.locator('html')).toHaveClass(/motion-paused/);
  await expect(page.locator('.premium-tracker')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.motion-toggle')).toBeHidden();
});

test('motion can be paused manually', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Остановить анимацию' }).click();
  await expect(page.locator('html')).toHaveClass(/motion-paused/);
  await page.getByRole('button', { name: 'Включить анимацию' }).click();
  await expect(page.locator('html')).not.toHaveClass(/motion-paused/);
});
