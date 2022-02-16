import {recipes, prices} from "./helpers.js";

if(prices)
{
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
}else{
    console.log("Price data not found! Run `npm run scrape` to scrape the data.");
}