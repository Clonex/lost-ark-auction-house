import robot from "robotjs";
import clipboard from "clipboardy";

import { createWorker } from 'tesseract.js';
import {captureImage, wait} from "./helpers.js";


export default class AuctionExtractor {
    SEARCH_POS = {x: 1551, y: 243};
    LOADING_POS = {x: 1060, y: 447};
    PRICE_POS = {x: 1082, y: 312};

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
        // const test = await this.getPrice("Strong Iron Ore");
        // console.log("Got something", test);
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
        // await clipboard.read();
        robot.keyTap('v', 'control');
        
        // robot.typeStringDelayed(itemName, 99999999999999);
        robot.keyTap("enter");
        
        // Wait for search results
        await wait(120);
        while(robot.getPixelColor(this.LOADING_POS.x, this.LOADING_POS.y) === this.LOADING_COLOR)
        {
            await wait(100);
        }
        
        const price = await captureImage(this.PRICE_POS.x, this.PRICE_POS.y, 123, 39, itemName);
        
        
        await this._worker.load();
        await this._worker.loadLanguage('eng');
        await this._worker.initialize('eng');
        await this._worker.setParameters({
            tessedit_char_whitelist: '0123456789.',
        });
        const { data: { text } } = await this._worker.recognize(price);
        return text.length > 0 ? Number(text.trim()) : false;
    }
}