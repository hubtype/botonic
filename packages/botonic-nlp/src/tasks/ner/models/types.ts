export type NerModelParameters = {
  dropout?: number
  units?: number
  learningRate?: number
}

export enum NER_TEMPLATE {
  BILSTM,
}
