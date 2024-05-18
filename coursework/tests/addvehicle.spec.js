const {test, expect} = require('@playwright/test');

const websiteURL = 'http://127.0.0.1:3000/people.html';

test.beforeEach(async ({ page }) => {
    await page.goto(websiteURL);
 });


 test("addvehcile with existing owner", async ({page})=> {

    await page.getByRole("link", {name: "Add a vehicle"}).click();
    await page.locator('#rego').fill('GXT95TE');
    await page.locator('#make').fill('BMW');
    await page.locator('#model').fill('X1');
    await page.locator('#colour').fill('white');
    await page.locator('#owner').fill('1');
    await page.getByRole('button', { name: 'Add vehicle' }).click();

    await expect(page.locator("#message")).toContainText("Vehicle added successfully");
 })


 test("missing fields", async ({page}) => {

   await page.getByRole("link", {name: "Add a vehicle"}).click();
   await page.locator('#rego').fill('GXT');
   await page.locator('#make').fill('Audi');
   await page.locator('#owner').fill('1');
   await page.getByRole("button", {name: "Add vehicle"}).click();

   await expect(page.locator("#message")).toContainText("Error");

 })


 test("missing fields in owner", async ({page}) => {

   await page.getByRole("link", {name: "Add a vehicle"}).click();
   await page.locator('#rego').fill('GTT9988W');
   await page.locator('#make').fill('BMW');
   await page.locator('#model').fill('X4');
   await page.locator('#colour').fill('green');
   await page.locator('#owner').fill('99');
   await page.getByRole('button', { name: 'Add vehicle' }).click();
   await expect(page.locator("#message")).toContainText("Vehicle added successfully");

   await page.locator("#personid").fill("99");
   await page.locator('#name').fill('Seiji');
   await page.locator('#address').fill('Nottingham');
   await page.locator('#dob').fill('1990-01-01');
   await page.getByRole("button", {name: "Add owner"}).click();
   await expect(page.locator("#message")).toContainText("Error");


 });


 test("add vehicle and new owner", async ({page}) => {

   await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('LKAS20K')
   await page.locator('#make').fill('BMW')
   await page.locator('#model').fill('M5')
   await page.locator('#colour').fill('black')
   await page.locator('#owner').fill('seiji')
   await page.getByRole('button', { name: 'Add vehicle' }).click();

   // add a new person
   await page.locator('#personid').fill('21')
   await page.locator('#name').fill('Seiji')
   await page.locator('#address').fill('Nottingham')
   await page.locator('#dob').fill('2002-10-30')
   await page.locator('#license').fill('SF90FEF')
   await page.locator('#expire').fill('2030-01-01')
   await page.getByRole('button', { name: 'Add owner' }).click();

   await expect(page.locator('#message')).toContainText('Vehicle added successfully')

 });