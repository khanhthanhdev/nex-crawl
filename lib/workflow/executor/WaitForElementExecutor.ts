
import { ExecutionEnvironment } from '@/types/executor';

import { WaitForTask } from '../task/WaitForElement';

export async function WaitForElementExecutor(
    environtment: ExecutionEnvironment <typeof WaitForTask>   ,
): Promise<boolean> {
    try {
        const selector = environtment.getInput("Selector");
        if (!selector) {
            environtment.log.error("Selector is required");
            return false;
        }


        const visibility = environtment.getInput("Visibility");
        if (!visibility) {
            environtment.log.error("Visibility is required");
            return false;
        }



        await environtment.getPage()!.waitForSelector(selector, {visible: visibility === "visible",
        hidden: visibility === "hidden"});
        
        environtment.log.info(`Element with selector ${selector} is ${visibility}`);
        return true;
    } catch (error: any) {
        environtment.log.error(error.message);
        return false;
    }
}