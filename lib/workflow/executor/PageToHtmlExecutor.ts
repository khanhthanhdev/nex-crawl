

import { ExecutionEnvironment } from '@/types/executor';

import { PageToHtmlTask } from '../task/PageToHtml';

export async function PageToHtmlExecutor(
    environtment: ExecutionEnvironment <typeof PageToHtmlTask>   ,
): Promise<boolean> {
    try {
        const html = await environtment.getPage()!.content();
        environtment.setOutput("Html", html);
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}