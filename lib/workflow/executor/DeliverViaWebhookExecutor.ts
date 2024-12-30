

import { ExecutionEnvironment } from '@/types/executor';

import { DeliverViaWebhookTask } from '../task/DeliverViaWebhook';

export async function DeliverViaWebhookExecutor(
    environtment: ExecutionEnvironment <typeof DeliverViaWebhookTask>   ,
): Promise<boolean> {
    try {
        const targetURL = environtment.getInput("Target URL");
        if (!targetURL) {
            environtment.log.error("input -> targetURL is required");
            return false;
        }

        const body = environtment.getInput("Body");
        if (!body) {
            environtment.log.error("input -> body is required");
            return false;
        }
        
        const response = await fetch(targetURL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const statusCode = response.status;
        if (statusCode !== 200) {
            environtment.log.error(`Request failed with status code ${statusCode}`);
            return false;
        }

        const responseBody = await response.json();
        environtment.log.info(JSON.stringify(responseBody, null, 4));

        return true;
    } catch (error: any) {
        environtment.log.error(error.message);
        return false;
    }
}