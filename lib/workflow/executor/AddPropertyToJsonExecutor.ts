

import { ExecutionEnvironment } from '@/types/executor';

import { AddPropertyToJsonTask } from '../task/AddPropertyToJson';

export async function AddPropertyToJsonExecutor(
    environtment: ExecutionEnvironment <typeof AddPropertyToJsonTask>   ,
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

        const propertyValue = environtment.getInput("Property value");
        if (!propertyValue) {
            environtment.log.error("input -> Property value is required");
            return false;
        }

        const json = JSON.parse(jsonData);
        json[propertyName] = propertyValue;
        
        environtment.setOutput("Update JSON", JSON.stringify(json));
        
        return true;
    } catch (error: any) {
        environtment.log.error(error.message);
        return false;
    }
}