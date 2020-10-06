import { csvParse } from 'd3';
import { readFileSync } from 'fs';
import { DataSet } from './types';

export class DataReader {
  readData(path: string): DataSet {
    const extension = path.split('.').pop();
    switch (extension) {
      case 'csv':
        return this._readCSV(path);
      default:
        return [];
    }
  }

  private _readCSV(path: string): DataSet {
    const text = readFileSync(path, 'utf-8');
    const info = csvParse(text);
    return info.map((sample) => {
      return { label: sample.label, feature: sample.feature };
    });
  }
}
