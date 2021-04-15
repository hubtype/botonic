import { Dataset } from '../../src/dataset/dataset'
import { DATA_DIR_PATH } from './constants-helper'

export const dataset = Dataset.load(DATA_DIR_PATH)
