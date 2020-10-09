import { join } from 'path';

export const NLU_DIR = join(process.cwd(), 'tests', 'nlu');

export const MODELS_DIR = join(NLU_DIR, 'models');

export const SIMPLE_NN_DIR = join(MODELS_DIR, 'simple-nn');
export const SIMPLE_NN_MODEL_PATH = join(SIMPLE_NN_DIR, 'model.json');

export const UTTERANCES_DIR = join(NLU_DIR, 'utterances');

export const INTENTS = {
  '0': 'Gratitude',
  '1': 'BookRestaurant',
  '2': 'GetDirections',
  '3': 'Greetings',
};
