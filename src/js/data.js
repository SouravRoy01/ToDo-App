let instance = null;
class Data {
  constructor(data) {
    this.records = data;
  }

  get getData() {
    return this.records;
  }

  set setData(newData) {
    this.records = newData;
  }
}

export default function getDataInstance(data) {
  if (!instance) instance = new Data(data);
  return instance;
}
