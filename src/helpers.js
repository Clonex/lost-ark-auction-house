import fs from "fs";
import Jimp from "jimp";
import robot from "robotjs";

export const PRICE_CONFIG = process.cwd() + "\\src\\data\\prices.json";

export const recipes = JSON.parse(fs.readFileSync(process.cwd() + '\\src\\data\\recipes.json'));
export const prices = fs.existsSync(PRICE_CONFIG) ? JSON.parse(fs.readFileSync(PRICE_CONFIG)) : false;

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


export function captureImage(x, y, w, h, ID ) {
  const pic = robot.screen.capture(x, y, w, h);
  const width = (pic.byteWidth) / pic.bytesPerPixel; // pic.width is sometimes wrong!
  const height = pic.height;
  const image = new Jimp(width, height);
  let red, green, blue;
  let LIMIT = 100;
  pic.image.forEach((byte, i) => {
    switch (i % 4) {
      case 0: return blue = byte
      case 1: return green = byte
      case 2: return red = byte
      case 3: 
        if(red >= LIMIT ||  green >= LIMIT || blue >= LIMIT)
        {
          image.bitmap.data[i - 3] = 255;
          image.bitmap.data[i - 2] = 255;
          image.bitmap.data[i - 1] = 255;
        }else{
            image.bitmap.data[i - 3] = 0;
            image.bitmap.data[i - 2] = 0;
            image.bitmap.data[i - 1] = 0;
        }
        image.bitmap.data[i] = 255;
    }
  })
  // image.writeAsync(`./test-${ID}.png`);
  return image.getBufferAsync(Jimp.MIME_PNG);
}

export function wait(ms){
    return new Promise(r => setTimeout(r, ms));
}