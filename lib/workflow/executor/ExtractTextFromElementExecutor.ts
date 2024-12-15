

import { ExecutionEnvironment } from '@/types/executor';

import { ExtractTextFromElement } from '../task/ExtractTextFromElement';
import * as cheerio from 'cheerio';

export async function ExtractTextFromHtmlExecutor(
    environtment: ExecutionEnvironment <typeof ExtractTextFromElement>   ,
): Promise<boolean> {
    try {
        const selector = environtment.getInput("Selector");
        if (!selector) {
            environtment.log.error("Selector not defined");
            return false;
        }
        const html = environtment.getInput("Html");
        
        if(!html) {
            environtment.log.error("Html not defined");
            return false;
        }

        const $ = cheerio.load(html);
        const element = $(selector);

        if (!element) {
            environtment.log.error("Element not found");
            return false;
        }

        const extractedText = $.text(element);
        if (!extractedText) {
            environtment.log.error("Extracted text is empty");
            return false;
        }

        environtment.setOutput("Extracted text", extractedText);

        return true;
    } catch (error :any) {
        environtment.log.error(error.message);
        return false;
    }
}