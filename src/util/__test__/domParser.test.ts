import { parseAsinInfo } from '../domParser';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('domParser', () => {
  it('extracts ASIN Info from valid html string', () => {
    const htmlString = readFileSync(join(__dirname, 'umbrella.html'), 'utf8');
    const parsedObject = parseAsinInfo(htmlString);
    expect(parsedObject).toEqual({
      productDimensions: '11.5 x 2 x 2 inches',
      rank:
        '#20 in Clothing, Shoes & Jewelry (See Top 100 in Clothing, Shoes & Jewelry)\n        \n              \n                #1 in Clothing, Shoes & Jewelry > Luggage & Travel Gear > Umbrellas > Folding Umbrellas',
    });
  });
});
