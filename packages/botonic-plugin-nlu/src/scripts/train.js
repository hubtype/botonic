import { BotonicNLU } from '../botonic-nlu'
// const developerPath = path.join(process.env.INIT_CWD, 'src')
// const nluPath = path.join(developerPath, NLU_DIRNAME)
// const utterancesPath = path.join(nluPath, UTTERANCES_DIRNAME)
// const nluConfigPath = path.join(nluPath, NLU_CONFIG_FILENAME)
;(async () => {
  let botonicNLU = new BotonicNLU({
    nluPath: '/Users/marcrabat/Desktop/nlu/'
    // TODO: podria ser independent de diferents formats, es podria agafar amb una crida csv, axios, contentful, p.ex.
    //languages: parseLangFlag(process.argv)
    // languages: ['eng', 'spa']
  })
  await botonicNLU.train()
})()
