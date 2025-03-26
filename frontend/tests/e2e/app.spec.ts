import { Builder } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome'; // Import Chrome Options
import { expect } from 'chai';

describe('Main Page Tests', () => {
    let driver: any;

    before(async () => {
        const chromeOptions = new Options();

        driver = await new Builder()
            .forBrowser('chrome')
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

    it('should display correct heading 1', async () => {
        const heading = await driver.findElement({ tagName: 'h1' }).getText();
        expect(heading).to.equal('SPIN');
    });

    it('should display correct heading 2', async () => {
        const heading = await driver.findElement({ tagName: 'h2' }).getText();
        expect(heading).to.equal('Signal Propagation Inspector');
    });

    it('should display correct heading 3', async () => {
        const heading = await driver.findElement({ tagName: 'h3' }).getText();
        expect(heading).to.equal('Welcome to the FPGA Educational Simulator');
    });

    it('should display correct paragraph', async () => {
        const paragraph = await driver.findElement({ tagName: 'p' }).getText();
        expect(paragraph).to.include('Get Started');
    });

    it('should display correct buttons', async () => {
        const buttons = await driver.findElements({ tagName: 'button' });
        expect(buttons).to.have.lengthOf(2);

        const button1Text = await buttons[0].getText();
        const button2Text = await buttons[1].getText();

        expect(button1Text).to.equal('Visualize');
        expect(button2Text).to.equal('Create');
    });
});

describe('Page 1 Tests', () => {
    let driver: any;

    before(async () => {
        const chromeOptions = new Options();       

        driver = await new Builder()
            .forBrowser('chrome')
            .build();

        await driver.get('https://two024-2025-project-4-web-fpga-team-5.onrender.com/page1'); // TODO: change with the real page name
    });

    after(async () => {
        if (driver) { // Check if driver is defined
            await driver.quit();
        }
    });

    it('should display correct heading 1', async () => {
        const heading = await driver.findElement({ tagName: 'h1' }).getText();
        expect(heading).to.equal('SPIN');
    });

    it('should display correct heading 2', async () => {
        const heading = await driver.findElement({ tagName: 'h2' }).getText();
        expect(heading).to.equal('Signal Propagation Inspector');
    });

    it('should display correct heading 3', async () => {
        const heading = await driver.findElement({ tagName: 'h3' }).getText();
        expect(heading).to.equal('Welcome To The Visualization');
    });
});


describe('Page 2 Tests', () => {
    let driver: any;

    before(async () => {
        const chromeOptions = new Options();

        driver = await new Builder()
            .forBrowser('chrome')
            .build();

        await driver.get('https://two024-2025-project-4-web-fpga-team-5.onrender.com/page2'); // TODO: change with the real page name
    });

    after(async () => {
        if (driver) { // Check if driver is defined
            await driver.quit();
        }
    });

    it('should display correct heading 1', async () => {
        const heading = await driver.findElement({ tagName: 'h1' }).getText();
        expect(heading).to.equal('SPIN');
    });

    it('should display correct heading 2', async () => {
        const heading = await driver.findElement({ tagName: 'h2' }).getText();
        expect(heading).to.equal('Signal Propagation Inspector');
    });

    it('should display correct heading 3', async () => {
        const heading = await driver.findElement({ tagName: 'h3' }).getText();
        expect(heading).to.equal('Welcome to the Creation Interface');
    });
});