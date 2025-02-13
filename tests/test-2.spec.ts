import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByLabel('binary-editor_item-add').click();

  // 입력을 다루는 코드
  await page.getByLabel('binary-editor_item-add').pressSequentially('11111111');
  
  await expect(page.getByLabel('hex-editor_item-0')).toContainText('FF');
  await page.getByRole('button', { name: 'parse' }).click();
  await expect(page.getByLabel('result panel')).toContainText('error!');
  await page.getByRole('button', { name: 'clear' }).click();
  await expect(page.getByLabel('result panel')).toContainText('');
});