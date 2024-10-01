# trading-212 strategy

- first fetch the portfolio
- then fetch the instruments
- for each portfolio item, find the instrument and append currency, name, shortname and type from it.
  

# calculating returns

- gather the items from portfolio, and create a map of corresponding yahoo symbols
- for each portfolio item, get the yahoo quote
- calculate returns in USD and EUR for each item
  - if yahoo quote currency matches the item's currency, calculate directly
  - if not, convert unmatched currency to USD and EUR and then calculate
  
  