import fs from "fs";

export const PRICE_CONFIG = process.cwd() + "\\src\\data\\prices.json";

export const recipes = JSON.parse(fs.readFileSync(process.cwd() + '\\src\\data\\recipes.json'));
export const prices = JSON.parse(fs.readFileSync(PRICE_CONFIG));

export function generatePriceConfig(data)
{
    let out = {};
    data.forEach(d => {
        if(!out[d.name])
        {
            out[d.name] = 0;
        }
        d.materials.forEach(mat => {
            if(!out[mat.name])
            {
                out[mat.name] = 0;
            }
        });
    });
    return out;
}