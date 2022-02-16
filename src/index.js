import {existsSync, writeFileSync} from "fs";


import {recipes, generatePriceConfig, PRICE_CONFIG, prices} from "./helpers.js";

if(!existsSync(PRICE_CONFIG))
{
    writeFileSync(PRICE_CONFIG, JSON.stringify(generatePriceConfig(recipes)));
    console.log("Fill out the auction prices in", PRICE_CONFIG, "and re-run.");
}else{
    const cost = recipes.map(recipe => {
        recipe.cost = recipe.materials.reduce((cost, curr) => {
            cost += Number(prices[curr.name]) * curr.amount;
            return cost;
        }, 0);
        recipe.price = prices[recipe.name];
        recipes.profit = recipe.price - recipe.cost;
        return recipe;
    }).sort((a, b) => a.profit - b.profit);
    console.log(cost);
}