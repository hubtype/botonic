// Declaraciones globales para resolver conflictos de tipos

declare module 'nodemon' {
  const nodemon: any
  export = nodemon
}

declare module '@types/inquirer' {
  interface Question<T> {
    [key: string]: any
  }

  interface Answers {
    [key: string]: any
  }
}
