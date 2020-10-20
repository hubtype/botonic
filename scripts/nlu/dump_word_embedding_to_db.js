const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
try {
  process.argv[2].match(/.*-.*d-.*.txt/)
  let input = process.argv[2]
  let inputFileName = input.split('.txt')[0]
  const db = new sqlite3.Database(`./${inputFileName}.db`)
  let f = fs.readFileSync(input, 'utf-8')
  let embeddings = f.split('\n')

  db.serialize(function () {
    let table = 'embeddings'
    db.run(`CREATE TABLE ${table} (token TEXT, vector TEXT)`)
    const stmt = db.prepare(`INSERT INTO ${table} VALUES (?, ?)`)
    for (let i = 0; i < embeddings.length; i++) {
      console.log('Current IDX: ', i)
      let splitted = embeddings[i].split(' ')
      let token = splitted[0]
      let vector = splitted.slice(1).join(' ')
      let d = "'"
      if (token.includes("'")) {
        d = '"'
      }
      stmt.run(token, vector, function (err, lala) {
        if (err != null) {
          console.log(`\n\nERR(${token})`, err)
        }
      })
    }
    stmt.finalize()
  })

  db.close()
} catch (e) {
  console.log('Usage: Pass as flag the file to be dumped into a .db file.')
  console.log(
    '- Required format: {ALGORITHM_NAME}-{DIMENSIONS}d-{LANGUAGE_CODE(ISO639-1)}.txt'
  )
  console.log('- Example: glove-50d-en.txt')

  console.log('\n Format for Word Embeddings file:')
  console.log('   {token_1} v_11 v_12 v_13 v_14 ... v_1N\\n')
  console.log('   {token_2} v_21 v_22 v-23 v_24 ... v_2N\\n')
  console.log('   {token_3} v_31 v_32 v_33 v_34 ... v_3N\\n')
  console.log('   {token_i} v_i1 .... .... .... ... v_iN\\n')
  console.log('   {token_M} v_M1 .... .... .... ... v_MN')
}
