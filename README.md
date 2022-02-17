# Auction house

**WORK IN PROGRESS**
Goal of this project it to extract all prices for all recipes from Lost ark auction house, and find the best recipes to flip, or make yourself.


## Grab recipe data
```
yarn grab
```


## Grab data from auction house
This controls your mouse and uses OCR to extract the price information. 
**Beaware**: re-configuration might be needed if a different screen resoution is used. This can be changed in `src/AuctionExctractor.js` line 9 - 12.
```
yarn scrape
```


## Analyze data
```
yarn start
```

