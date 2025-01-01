

import { ExecutionEnvironment } from '@/types/executor';

import { NavigateUrlTask } from '../task/NavigateUrlTask';

export async function NavigateUrlExecutor(
    environtment: ExecutionEnvironment <typeof NavigateUrlTask>   ,
): Promise<boolean> {
    try {
        const url = environtment.getInput("URL");
        if (!url) {
            environtment.log.error("input -> url is required");
            return false;
        }
        await environtment.getPage()!.goto(url);
        environtment.log.info(`Navigated to ${url}`);
        return true;
    } catch (error: any) {
        environtment.log.error(error.message);
        return false;
    }
}