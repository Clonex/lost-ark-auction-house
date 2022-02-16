import {recipes, prices} from "./helpers.js";



if(prices)
{
    const cost = recipes.map(recipe => {
        if(!prices[recipe.name])
        {
            return false;
        }
        recipe.cost = recipe.materials.reduce((cost, curr) => {
            if(curr.name === "Gold")
            {
                cost += curr.amount;
            }else{
                const price = prices[curr.name] ? prices[curr.name] : 100;
                cost += Number(price) * curr.amount;
            }
            return cost;
        }, 0);
        recipe.price = prices[recipe.name] ? prices[recipe.name] : recipe.cost;
        recipe.profit = recipe.price - recipe.cost;
        return recipe;
    }).filter(d => d).sort((a, b) => a.profit - b.profit);
    console.log(cost);

    setTimeout(() => {}, 1000 * 60 * 60);
}else{
    console.log("Price data not found! Run `npm run scrape` to scrape the data.");
}