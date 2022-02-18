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
                const price = prices[mat.name] ? prices[mat.name] : 100;
                mat.cost = Number(price) * mat.amount;
            }
            return mat;
        });

        recipe.cost = recipe.materials.reduce((cost, curr) => {
            // if(curr.name === "Gold")
            // {
            //     cost += curr.amount;
            // }else if(!gathers.includes(curr.name)){
            //     const price = prices[curr.name] ? prices[curr.name] : 100;
            //     cost += Number(price) * curr.amount;
            // }
            return cost + curr.cost;
        }, 0);
        recipe.price = prices[recipe.name] ? prices[recipe.name] : recipe.cost;
        recipe.profit = recipe.price - recipe.cost;
        return recipe;
    }).filter(d => d && d.materials.length > 0).sort((a, b) => a.profit - b.profit);
    console.log(cost);//, prices, recipes);

    setTimeout(() => {}, 1000 * 60 * 60);
}else{
    console.log("Price data not found! Run `yarn ocr` to OCR the data.");
}