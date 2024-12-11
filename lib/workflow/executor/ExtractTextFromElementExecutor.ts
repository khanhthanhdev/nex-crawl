

import { ExecutionEnvironment } from '@/types/executor';

import { ExtractTextFromElement } from '../task/ExtractTextFromElement';
import * as cheerio from 'cheerio';

export async function ExtractTextFromHtmlExecutor(
    environtment: ExecutionEnvironment <typeof ExtractTextFromElement>   ,
): Promise<boolean> {
    try {
        const selector = environtment.getInput("Selector");
        if (!selector) {
            console.error("Selector not defined");
            return false;
        }
        const html = environtment.getInput("Html");
        
        if(!html) {
            console.error("Html not defined");
            return false;
        }

        const $ = cheerio.load(html);
        const element = $(selector);

        if (!element) {
            console.log("Element not found");
            return false;
        }

        const extractedText = $.text(element);
        if (!extractedText) {
            console.log("Extracted text is empty");
            return false;
        }

        environtment.setOutput("Extracted text", extractedText);

        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}