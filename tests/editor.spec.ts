import { test, expect } from '@playwright/test';

test('비정상 입력 후 파싱 버튼 클릭 시 결과 패널에 에러가 발생한다.', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // 데이터를 입력한다
  await page.getByLabel('binary-editor', { exact: true }).click();
  await page.getByLabel('binary-editor', { exact: true }).pressSequentially("11111111");

  // 파싱 버튼을 입력한다.
  await page.getByRole('button', { name: 'parse' }).click();

  // 파싱 실패
  await expect(page.getByLabel('result panel')).toMatchAriaSnapshot(`- text: error!`);
});


test('정상 입력 후 파싱 버튼 클릭 시 결과 패널에 정상적인 데이터가 나온다(1)', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // 데이터를 입력한다. 2진법으로 0xAA
  await page.getByLabel('binary-editor_item-add').click();
  await page.getByLabel('binary-editor', { exact: true }).pressSequentially("001000010000000110101010");

  // 파싱 버튼을 클릭한다.
  await page.getByRole('button', { name: 'parse' }).click();

  // 파싱 성공
  const panel = page.getByLabel('result panel');
  await expect(panel).toContainText("0xAA")
});

test('정상적인 입력 후 파싱 버튼 클릭 시 결과 패널에 정상 데이터가 나온다(2)', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByLabel('hex-editor_item-add').click();
  await page.getByLabel('hex-editor_item-add').pressSequentially('0102a90201c801034106313233313233a902e0f34106313233343536');
  
  await page.getByRole('button', { name: 'parse' }).click();
  await expect(page.getByLabel('result panel')).toMatchAriaSnapshot(`- text: /<L \\[2\\] <U2 \\d+> <L \\[3\\] <A "\\d+"> <U2 \\d+> <A "\\d+"> > > \\./`);
});