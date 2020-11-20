This is a script that allows you to generate new word embeddings to use alongside with @botonic/plugin-nlu.

Usage: Specify as argument the embeddings file to be dumped into a .db file.
Example: \$ node dump_word_embedding_to_db.js input_file.txt

- Required format: {ALGORITHM_NAME}-{DIMENSIONS}d-{LANGUAGE_CODE(ISO639-1)}.txt'
- Example: glove-50d-en.txt

Format for Word Embeddings file:
{token_1} v_11 v_12 v_13 v_14 ... v_1N\n
{token_2} v_21 v_22 v-23 v_24 ... v_2N\n
{token_3} v_31 v_32 v_33 v_34 ... v_3N\n
{token_i} v_i1 .... .... .... ... v_iN\n
{token_M} v_M1 .... .... .... ... v_MN
