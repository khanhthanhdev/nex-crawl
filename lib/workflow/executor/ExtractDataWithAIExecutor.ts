

import { ExecutionEnvironment } from '@/types/executor';

import { ClickElementTask } from '../task/ClickElement';
import { ExtractDataWithAITask } from '../task/ExtractDataWithAI';
import prisma from '@/lib/prisma';
import { symmetricDecrypt } from '@/lib/encryption';

export async function ExtractDataWithAIExecutor(
    environtment: ExecutionEnvironment <typeof ExtractDataWithAITask>   ,
): Promise<boolean> {
    try {
        const credentials = environtment.getInput("Credentials");
        if (!credentials) {
            environtment.log.error("input->credentials is required");
            return false;
        }

        const prompt = environtment.getInput("Prompt");
        if (!prompt) {
            environtment.log.error("input->prompt is required");
            return false;
        }

        const content = environtment.getInput("Content");
        if (!content) {
            environtment.log.error("input->content is required");
            return false;
        }

        // Get credentials from DB
        const credential = await prisma.credential.findUnique({
            where: {
                id: credentials,
            },
        })

        if (!credential) {
            environtment.log.error("credential not found");
            return false;
        }

        const plainCredentialValue = symmetricDecrypt(credential.value);
        if (!plainCredentialValue) {
            environtment.log.error("Failed to decrypt credential value");
            return false;
        }

        const mockExtractedData = {
            usernameSelector: "#username",
            passwordSelector: "#password",
            loginSelector: "body > div > form > input.btn.btn-primary",
        }

        environtment.setOutput("Extracted data", JSON.stringify(mockExtractedData));

        return true;
    } catch (error: any) {
        environtment.log.error(error.message);
        return false;
    }
}