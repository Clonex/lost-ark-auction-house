//https://lostarkcodex.com/query.php?a=recipes&l=us&_=1645112230992
import fetch from "node-fetch";
import fs from "fs";
import {JSDOM} from "jsdom";

function grabber()
{
    let out = {};
    const data = await fetch("https://lostarkcodex.com/query.php?a=recipes&l=us&_=1645112230992").then(d => d.json()).catch(_ => false);
    if(data)
    {
        let d = data.aaData.map(([id]) => ({
            id,
        }));
        let promises = [];
        for(let i = 0; i < d.length; i++) // d.length
        {
            const id = d[i].id;
            promises.push(fetch(`https://lostarkcodex.com/tip.php?id=recipe--${id}&l=us&nf=on`).then(d => d.text()).then(html => {
                console.log("Got data for ID", id);
                // const $ = cheerio.load(d);
                const sections = html.split("Products:");
                const dom = new JSDOM(sections[0]).window.document;
                const outputDOM = new JSDOM(sections[1]).window.document;
                out[id] = {
                    id,
                    name: dom.querySelector(".item_title").textContent,
                    materials: [...dom.querySelectorAll(".quantity")].map(d => ({
                        id: d.previousElementSibling.dataset.id.split("--")[1],
                        amount: Number(d.textContent),
                    })),
                    amount: Number(outputDOM.querySelector(".quantity")?.textContent ?? 1),
                    cost: Number(html.split("Cost:<br>")?.[1]?.split("<")?.[0] ?? 0),
                };
            }));
        }
        await Promise.all(promises);

        // console.log(Object.values(out)[0]);
        console.log(JSON.stringify(out));
    }
    return out;
}

grabber().then(data => fs.writeFileSync("scrapedData.json", JSON.stringify(data)));