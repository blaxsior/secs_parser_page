import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByLabel('hex-editor_item-add').click();
  await page.getByLabel('hex-editor_item-add').pressSequentially('0102a90201c801034106313233313233a902e0f34106313233343536');
  
  await page.getByRole('button', { name: 'parse' }).click();
  await expect(page.getByLabel('result panel')).toMatchAriaSnapshot(`- text: /<L \\[2\\] <U2 \\d+> <L \\[3\\] <A "\\d+"> <U2 \\d+> <A "\\d+"> > > \\./`);
});