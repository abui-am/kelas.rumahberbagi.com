import { expect } from '@playwright/test'
import { test } from './base-test'

test.use({
  storageState: 'e2e/fixtures/auth/member-edit.local.json',
})

test('Validate phone number when updating data', async ({
  page,
  noscript,
  queries: { getByRole },
}) => {
  // Go to http://localhost:3000/dashboard/profile/edit

  await page.goto('/dashboard/profile/edit')
  // Query phoneNumber
  const phoneNumber = await getByRole('textbox', {
    name: /nomor whatsapp/i,
  })
  // Fill phoneNumber
  await phoneNumber.fill('6512345678')
  // Press Tab
  await phoneNumber.press('Tab')
  // Expect visibility only when JavaScript is enabled
  if (!noscript) {
    await expect(
      page
        .locator(
          'text=Nomor WhatsApp harus mengandung kode negara dan nomor telepon'
        )
        .first()
    ).toBeVisible()
  }
  // Fill phoneNumber
  await phoneNumber.fill('+6512345678')
  // Click text=Save
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/dashboard' }*/),
    page.click('text=Simpan'),
  ])
  // Expect invisibility
  await expect(
    page
      .locator(
        'text=Nomor WhatsApp harus mengandung kode negara dan nomor telepon'
      )
      .first()
  ).not.toBeVisible()
})

test('Validate name when updating data', async ({
  page,
  noscript,
  queries: { getByRole },
}) => {
  await page.goto('/dashboard/profile/edit')

  const name = await getByRole('textbox', {
    name: /nama lengkap/i,
  })

  await name.fill('')
  await name.press('Tab')

  if (!noscript) {
    await expect(
      page.locator('text=Nama Lengkap wajib diisi').first()
    ).toBeVisible()
  }

  await name.fill('Lorem I')
  await page.click('text=Simpan')

  await expect(
    page.locator('text=Nama Lengkap wajib diisi').first()
  ).not.toBeVisible()
})

test('Update profile', async ({ page, queries: { getByRole } }) => {
  await page.goto('/dashboard/profile/edit')

  // Get element by role
  const name = await getByRole('textbox', {
    name: /nama lengkap/i,
  })
  const phoneNumber = await getByRole('textbox', {
    name: /nomor whatsapp/i,
  })
  const telegram = await getByRole('textbox', {
    name: /username telegram/i,
  })
  const instagram = await getByRole('textbox', {
    name: /username instagram/i,
  })
  // Fill all input
  await name.fill('Lorem Ipsum')
  await phoneNumber.fill('+6289123456')
  await telegram.fill('@lorem_tl')
  await instagram.fill('@lorem_ig')

  // Submit form and wait for the redirect to the /profile page
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/dashboard/profile' }*/),
    page.click('text=Simpan'),
  ])

  // Expect to see the new data on the View profile page
  await expect(page.locator('text=+6289123456').first()).toBeVisible()
  await expect(page.locator('text=@lorem_tl').first()).toBeVisible()
  await expect(page.locator('text=@lorem_ig').first()).toBeVisible()

  // Go back to the /profile/edit page
  await page.click('text=Ubah')
  await expect(page).toHaveURL('http://localhost:3000/dashboard/profile/edit')

  // Expect to see the new data prefilled
  await expect(page.locator('[value="Lorem Ipsum"]').first()).toBeVisible()
  await expect(page.locator('[value="+6289123456"]').first()).toBeVisible()
  await expect(page.locator('[value="@lorem_tl"]').first()).toBeVisible()
  await expect(page.locator('[value="@lorem_ig"]').first()).toBeVisible()
})
