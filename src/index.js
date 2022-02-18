import {recipes, prices} from "./helpers.js";

if(prices)
{
    const gathers = [];//["Wild Flower", "Shy Wild Flower", "Bright Wild Flower", "Timber", "Tender Timber", "Sturdy Timber", "Iron Ore", "Heavy Iron Ore", "Strong Iron Ore"];
    const cost = Object.values(recipes).map(recipe => {
        if(!prices[recipe.name])
        {
            return false;
        }
        recipe.materials = recipe.materials.map(mat => {
            mat.cost = 0;
            mat.name = recipes[mat.urlID]?.name;
            if(mat.name === "Gold")
            {
                mat.cost = mat.amount;
            }else if(!gathers.includes(mat.name)){
                const price = prices[mat.name] ? prices[mat.name].price : 100;
                mat.cost = Number(price) * mat.amount;
            }
            return mat;
        });

        recipe.cost = recipe.materials.reduce((cost, curr) => cost + curr.cost, 0);

        const auctionPrice = prices[recipe.name];
        if(auctionPrice)
        {
            recipe.lowPrice = auctionPrice.lowPrice;
            recipe.price = auctionPrice.price;
        }else{
            recipe.lowPrice = recipe.cost;
            recipe.price = recipe.cost;
        }
        recipe.profit = recipe.price - recipe.cost;
        recipe.priceDiff = recipe.price - recipe.lowPrice;
        return recipe;
    }).filter(d => d && d.materials.length > 0).sort((a, b) => a.profit - b.profit);//.sort((a, b) => a.priceDiff - b.priceDiff);
    console.log(cost);//, prices, recipes);

    setTimeout(() => {}, 1000 * 60 * 60);
}else{
    console.log("Price data not found! Run `yarn ocr` to OCR the data.");
}