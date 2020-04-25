import { promises as fs } from 'fs';
import { join } from 'path';

export class Collection {

  constructor(collectionName) {
    this.filePath = join(process.cwd(), 'data', collectionName + '.json');
  }

  list() {
    return this._readData();
  }

  async insertOne(doc) {
    doc.id = Math.random().toString(16).slice(-12) + Math.random().toString(16).slice(-12);
    const documents = await this._readData();
    documents.push(doc);
    return this._writeData(documents);
  }

  async findOne(query) {
    return this._readData()
      .then(items => items.find(item => item.id === query.id));
  }

  async _readData() {
    const fileData = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(fileData);
  }

  _writeData(data) {
    return fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
  async deleteOne(id) {
    const documents = await this._readData();
    const deletedHomeworks = documents.filter(doc => {
      return doc.id !== id;
    });
    return this._writeData(deletedHomeworks);
  }
  async updateOne(id, update) {
    const documents = await this._readData();
    const updatedHomeworks = documents.map(doc =>
      (doc.id === id) ? Object.assign({}, doc, update) : doc);
    return this._writeData(updatedHomeworks);
  }
}
