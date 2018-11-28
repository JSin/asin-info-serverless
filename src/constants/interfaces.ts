export interface AsinInformationItem {
  //  Could extend AsinInfoResponse but they independent
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

export interface AsinInfoResponse {
  productDimensions: string;
  rank: string;
}
