

import { ExecutionEnvironment } from '@/types/executor';

import { PageToHtmlTask } from '../task/PageToHtml';

export async function PageToHtmlExecutor(
    environtment: ExecutionEnvironment <typeof PageToHtmlTask>   ,
): Promise<boolean> {
    try {
        const websiteUrl = environtment.getInput("Web page");
        console.log("URL", websiteUrl);
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}