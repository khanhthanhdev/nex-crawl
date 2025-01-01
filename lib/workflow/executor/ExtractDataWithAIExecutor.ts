
import OpenAI from "openai";
import { ExecutionEnvironment } from '@/types/executor';


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

        const openai = new OpenAI({
            apiKey: plainCredentialValue,
            baseURL: "https://api.together.xyz/v1"
        })

        const response = await openai.chat.completions.create({
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you want to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text",
                },
                {
                    role: "user",
                    content: prompt,
                },
                {
                    role: "user",
                    content: content,
                }
            ],
            temperature: 1,
            max_tokens: 4096,
        });

        environtment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
        environtment.log.info(`Completition tokens: ${response.usage?.completion_tokens}`);

        const result = response.choices[0].message?.content;
        if (!result) {
            environtment.log.error("Failed to extract data from AI");
            return false;
        };

        environtment.setOutput("Extracted data", result);

        return true;
    } catch (error: any) {
        environtment.log.error(error.message);
        return false;
    }
}