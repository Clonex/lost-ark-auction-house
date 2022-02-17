import {recipes, generatePriceConfig, PRICE_CONFIG, wait} from "./helpers.js";
import {writeFileSync} from "fs";

import AuctionExctractor from "./AuctionExctractor.js";

console.log("Starting auction house scrape..");
await wait(2500);
const prices = generatePriceConfig(recipes);

// console.log(Object.keys());
let auction = new AuctionExctractor();
const data = await auction.start(prices);
console.log("Got data", data);
writeFileSync(PRICE_CONFIG, JSON.stringify(data));