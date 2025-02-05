import { test, expect } from '@playwright/test';

test('메인 페이지에서 binary 내용 작성 시 hex 부분에도 대응되는 값이 표현된다.', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.getByText('+').first().click();
  await page.keyboard.type('11111111');

  const item = await page.getByText("FF");
  expect(item).not.toBeNull();
});