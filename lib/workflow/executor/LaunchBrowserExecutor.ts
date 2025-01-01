
import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import puppeteer from 'puppeteer';
import { LaunchBrowserTask } from '../task/LaunchBrowser';

export async function LaunchBrowserExecutor(
    environtment: ExecutionEnvironment<typeof LaunchBrowserTask>,
): Promise<boolean> {
    try {
        const websiteUrl = environtment.getInput("Website URL");

        const browser = await puppeteer.launch({
            headless: true,
        });
    environtment.log.info("Browser started successfully");
    environtment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environtment.setPage(page);
    environtment.log.info(`Navigated to ${websiteUrl}`);
    return true;
} catch (error: any) {
    environtment.log.error(error.message)
    return false;
}
}