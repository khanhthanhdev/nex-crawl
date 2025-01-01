

import { ExecutionEnvironment } from '@/types/executor';

import { ScrollToElementTask } from '../task/ScollToElement';

export async function ScrollToElementExecutor(
    environtment: ExecutionEnvironment <typeof ScrollToElementTask>   ,
): Promise<boolean> {
    try {
        const selector = environtment.getInput("Selector");
        if (!selector) {
            environtment.log.error("input->selector is required");
            return false;
        }
        await environtment.getPage()!.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (!element) {
                throw new Error(`Element with selector ${selector} not found`);
            }
            
            const top = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top });
        }, selector)
        return true;
    } catch (error: any) {
        environtment.log.error(error.message);
        return false;
    }
}