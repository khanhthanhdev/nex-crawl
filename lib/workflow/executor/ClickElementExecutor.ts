

import { ExecutionEnvironment } from '@/types/executor';

import { ClickElementTask } from '../task/ClickElement';

export async function ClickElementExecutor(
    environtment: ExecutionEnvironment <typeof ClickElementTask>   ,
): Promise<boolean> {
    try {
        const selector = environtment.getInput("Selector");
        if (!selector) {
            environtment.log.error("Selector is required");
            return false;
        }
        await environtment.getPage()!.click(selector);
        return true;
    } catch (error: any) {
        environtment.log.error(error.message);
        return false;
    }
}