

import { ExecutionEnvironment } from '@/types/executor';

import { ClickElementTask } from '../task/ClickElement';
import { ReadPropertyFromJsonTask } from '../task/ReadPropertyFromJson';

export async function ReadPropertyFromJsonExecutor(
    environtment: ExecutionEnvironment <typeof ReadPropertyFromJsonTask>   ,
): Promise<boolean> {
    try {
        const jsonData = environtment.getInput("JSON");
        if (!jsonData) {
            environtment.log.error("input -> JSON is required");
            return false;
        }

        const propertyName = environtment.getInput("Property name");
        if (!propertyName) {
            environtment.log.error("input -> Property name is required");
            return false;
        }


        const json = JSON.parse(jsonData);
        const propertyValue = json[propertyName];
        if (propertyValue === undefined) {
            environtment.log.error(`Property ${propertyName} not found in JSON`);
            return false;
        }

        environtment.setOutput("Property value", propertyValue);
        return true;
    } catch (error: any) {
        environtment.log.error(error.message);
        return false;
    }
}