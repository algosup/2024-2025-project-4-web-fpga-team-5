// tests/e2e/app.spec.ts
import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';

describe('Render.com Tests', () => {
    let driver: any;

    before(async () => {
        driver = await new Builder()
        .forBrowser('chrome')
        .build();
        
        await driver.get('https://two024-2025-project-4-web-fpga-team-5.onrender.com');
    });

    after(async () => {
        await driver.quit();
    });

    it('should display correct page title', async () => {
        const title = await driver.getTitle();
        expect(title).to.include('Vite + React');
    });
});