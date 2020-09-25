import {
  Sequential,
  LayersModel,
  loadLayersModel,
  Tensor,
} from '@tensorflow/tfjs-node';
import { Intents, Prediction } from './types';

export class NewModelManager {
  private _model: Sequential | LayersModel;
  private _intents: Intents;

  set intents(value: Intents) {
    this._intents = value;
  }

  async loadModel(modelPath: string) {
    this._model = await loadLayersModel(`file://${modelPath}`);
  }

  predict(input: Tensor): Prediction {
    let prediction: Prediction = {};
    const confidences = (this._model.predict(input) as Tensor).dataSync();
    confidences.forEach(
      (confidence: number, i: number) =>
        (prediction[this._intents[i]] = confidence),
    );
    return prediction;
  }
}
