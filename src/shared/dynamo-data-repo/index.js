export default class DynamoDataRepo {
  constructor(documentClient) {
    this.documentClient = documentClient;
  }
}