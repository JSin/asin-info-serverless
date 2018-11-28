import jsdom from 'jsdom'; // new jsdom type definitions don't exist so using Javascript
import { AsinInfoResponse } from '../constants/interfaces';

export const parseAsinInfo = (htmlString: string): AsinInfoResponse => {
  const parsedHtmlObject: AsinInfoResponse = {
    productDimensions: '',
    rank: '',
  };
  const dom = new jsdom.JSDOM(htmlString, { virtualConsole: new jsdom.VirtualConsole() });

  // Check product
  const productHeaders = dom.window.document.querySelectorAll('#productDetails_detailBullets_sections1 th');
  if (productHeaders.length > 0) {
    for (const tableHeader of productHeaders) {
      const headerText = tableHeader.textContent ? tableHeader.textContent.trim() : '';
      switch (headerText) {
        case 'Product Dimensions':
          parsedHtmlObject.productDimensions = tableHeader.nextElementSibling.textContent.trim();
          break;
        case 'Best Sellers Rank':
          parsedHtmlObject.rank = tableHeader.nextElementSibling.textContent.trim();
          break;
      }
    }
    return parsedHtmlObject;
  }
  // Check book
  const bookHeaders = dom.window.document.querySelectorAll('#productDetailsTable b');
  if (bookHeaders.length > 0) {
    for (const tableHeader of bookHeaders) {
      const headerText = tableHeader.textContent ? tableHeader.textContent.trim() : '';
      switch (headerText) {
        case 'Product Dimensions:':
          parsedHtmlObject.productDimensions = tableHeader.parentElement.textContent.trim();
          break;
        case 'Amazon Best Sellers Rank:':
          parsedHtmlObject.rank = tableHeader.parentElement.textContent.trim();
          break;
      }
    }
    return parsedHtmlObject;
  }
  // Check sales rank
  // Check book
  const sales = dom.window.document.querySelector('#SalesRank');
  if (sales) {
    parsedHtmlObject.rank = sales.textContent.trim();
    return parsedHtmlObject;
  }
  throw new Error('Unable to parse data');
};
