import { Builder } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome'; // Import Chrome Options
import { expect } from 'chai';

describe('Render.com Tests', () => {
    let driver: any;

    before(async () => {
        const chromeOptions = new Options();
        // Set a unique user data directory and headless mode
        chromeOptions.addArguments(
            '--user-data-dir=./temp_user_data',
            '--headless=new'
        );

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(chromeOptions) // Apply Chrome options
            .build();

        await driver.get('https://two024-2025-project-4-web-fpga-team-5.onrender.com');
    });

    after(async () => {
        if (driver) { // Check if driver is defined
            await driver.quit();
        }
    });

    it('should display correct page title', async () => {
        const title = await driver.getTitle();
        expect(title).to.include('Vite + React');
    });
});