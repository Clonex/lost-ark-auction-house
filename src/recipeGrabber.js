//https://lostarkcodex.com/query.php?a=recipes&l=us&_=1645112230992
import fetch from "node-fetch";
import fs from "fs";
import {JSDOM} from "jsdom";

import {RECIPES_PATH} from "./helpers.js";

function parseTip(html, id)
{
    // console.log("Got data for ID", id, d);
    // const $ = cheerio.load(d);
    const sections = html.split("Products:");
    const dom = new JSDOM(sections[0]).window.document;
    const outputDOM = new JSDOM(sections[1]).window.document;
    return {
        id,
        name: dom.querySelector(".item_title").textContent,
        materials: [...dom.querySelectorAll('[class="qtooltip"]')].map(d => ({
            urlID: d.dataset.id,//.split("--")[1],
            id: d.dataset.id.split("--")[1],
            amount: Number(d.nextElementSibling?.textContent ?? 1),
        })),
        amount: Number(outputDOM.querySelector(".quantity")?.textContent ?? 1),
        cost: Number(html.split("Cost:<br>")?.[1]?.split("<")?.[0] ?? 0),
    };
}

async function grabber()
{
    let out = {};
    const combatData = await fetch("https://lostarkcodex.com/query.php?a=items&type=consumables&l=us&_=1645128008024").then(d => d.json()).catch(_ => false);
    const data = await fetch("https://lostarkcodex.com/query.php?a=recipes&l=us&_=1645112230992").then(d => d.json()).catch(_ => false);
    if(data && combatData)
    {
        let combatD = combatData.aaData.map(([id]) => "recipe--10" + id);
        let d = data.aaData.map(([id]) => "recipe--" + id).filter(id => combatD.includes(id));//.filter((_, i) => i < 5);
        // d = ["recipe--600001"];
        let promises = [];
        for(let i = 0; i < d.length; i++) // d.length
        {
            const id = d[i];
            await (fetch(`https://lostarkcodex.com/tip.php?id=${id}&l=us&nf=on`).then(d => d.text()).then(html => {
                console.log(i, "/", d.length, "Got data for ID", id); //d);
                // const $ = cheerio.load(d);
                out[id] = parseTip(html, id);
                out[id].materials.forEach(mat => {
                    if(!d.includes(mat.urlID))
                    {
                        d.push(mat.urlID);
                    }
                });
            }));
        }
        await Promise.all(promises);

        // console.log(Object.values(out)[0]);
        console.log(JSON.stringify(out));
    }
    return out;
}

grabber().then(data => fs.writeFileSync(RECIPES_PATH, JSON.stringify(data)));