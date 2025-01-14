

import { ExecutionEnvironment } from '@/types/executor';

import { FillInputTask } from '../task/FillInput';

export async function FillInputExecutor(
    environtment: ExecutionEnvironment <typeof FillInputTask>   ,
): Promise<boolean> {
    try {
        const selector = environtment.getInput("Selector");
        if (!selector) {
            environtment.log.error("Selector is required");
            return false;
        }

        const value = environtment.getInput("Value");
        if (!value) {
            environtment.log.error("Value is required");
            return false;
        }

        await environtment.getPage()!.type(selector, value);
        return true;
    } catch (error: any) {
        environtment.log.error(error.message);
        return false;
    }
}