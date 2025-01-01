
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
            baseURL: "https://api.groq.com/openai/v1"
        })

        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a web scraper that extracts data from HTML or text inputs. You will receive input content and a prompt specifying the data required. Only return the extracted data as JSON, formatted as an array or object. Avoid additional explanations or text, ensuring that all outputs are valid JSON. If the specified data is not present, return an empty JSON array. Focus on precise data extraction and adhere strictly to the instructions.",
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