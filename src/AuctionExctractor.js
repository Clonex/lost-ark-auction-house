import robot from "robotjs";
import clipboard from "clipboardy";

import { createWorker } from 'tesseract.js';
import {captureImage, wait} from "./helpers.js";


export default class AuctionExtractor {
    SEARCH_POS = {x: 1551, y: 243};
    LOADING_POS = {x: 1060, y: 447};
    PRICE_POS = {x: 1082, y: 312};
    BUNDLE_POS = {x: 615, y: 333};

    LOADING_COLOR = "101114";

    _worker;
    constructor()
    {
        this._worker = createWorker({
            logger: m => {}
        });
    }

    async start(items)
    {
        let out = {};

        const names = Object.keys(items);
        for(let i = 0; i < names.length; i++) //names.length
        {
            const name = names[i];
            out[name] = await this.getPrice(name);
            console.log(`[${i}/${names.length}]`, "Got price for", name, "=", out[name]);
        }

        return out;
        // const test = await this.getPrice("Caldarr Thick Raw Meat");
        // console.log("Got something", test);
    }

    async ocr(x, y, width, height, charset, DEBUG = false)
    {
        const imgBuffer = await captureImage(x, y, width, height, DEBUG ? "test" : false);

        await this._worker.setParameters({
            tessedit_char_whitelist: charset,
        });
        const { data: { text } } = await this._worker.recognize(imgBuffer);
        return text ?? "";
    }

    async getPrice(itemName)
    {
        await clipboard.write(itemName);
        await wait(10);
        // To search bar and search
        robot.moveMouse(this.SEARCH_POS.x, this.SEARCH_POS.y);
        robot.mouseClick();

        robot.moveMouse(this.SEARCH_POS.x - 100, this.SEARCH_POS.y);
        robot.mouseClick();
        robot.keyTap('v', 'control');
        
        robot.keyTap("enter");
        
        // Wait for search results
        await wait(120);
        while(robot.getPixelColor(this.LOADING_POS.x, this.LOADING_POS.y) === this.LOADING_COLOR)
        {
            await wait(100);
        }
        
        await this._worker.load();
        await this._worker.loadLanguage('eng');
        await this._worker.initialize('eng');
        
        const priceText = await this.ocr(this.PRICE_POS.x, this.PRICE_POS.y, 123, 39, '0123456789.');
        const lowPriceText = await this.ocr(this.PRICE_POS.x + 160, this.PRICE_POS.y, 123, 39, '0123456789.');
        let price = priceText.length > 0 ? Number(priceText.trim()) : false;
        let lowPrice = lowPriceText.length > 0 ? Number(lowPriceText.trim()) : false;
        let unitSize = 1;

        if(price) // Adjust price if sold in bundles
        {
            const bundleText = (await this.ocr(this.BUNDLE_POS.x, this.BUNDLE_POS.y, 288, 17, ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz[]0123456789.')).split(" ");
            for(let i = 0; i < bundleText.length; i++)
            {
                const word = bundleText[i];
                if(word.toLowerCase().includes("units"))
                {
                    const unitSize = bundleText[i - 1];
                    price = price / Number(unitSize.trim());
                    lowPrice = lowPrice / Number(unitSize.trim());
                    break;
                }
            }
        }
        return {
            price,
            lowPrice,
            unitSize,
        };
    }
}