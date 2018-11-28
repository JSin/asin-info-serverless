export interface AsinInformationItem {
  asin: string;
  productDimensions: string;
  rank: string;
}

export interface PutItemAsinInformation {
  TableName: string;
  Item: AsinInformationItem;
}

export interface AsinRequest {
  asin: string;
}
