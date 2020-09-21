import { WEmbeddingsDBHelper } from '../../src/embeddings/wembeddings-db-helper';

describe('Word Embeddings DB Helper', () => {
  const UNSUPPORTED_LOCALE = 'af';
  const SUPPORTED_LOCALE = 'en';

  it('Word embedding not supported', async () => {
    const dbHelper = new WEmbeddingsDBHelper(
      '10k-fasttext',
      50,
      UNSUPPORTED_LOCALE,
    );
    expect(dbHelper.isValidWEmbedding).toBe(false);
  });

  it('Word embedding supported, connection to DB initialized', async () => {
    const dbHelper = new WEmbeddingsDBHelper('glove', 50, SUPPORTED_LOCALE);
    await dbHelper.initialize({ logProcess: false });
    expect(dbHelper.instance.open).toBe(true);
    expect(dbHelper.instance.readonly).toBe(true);
  });

  it('Some queries to the DB file', async () => {
    const dbHelper = new WEmbeddingsDBHelper('glove', 50, SUPPORTED_LOCALE);
    await dbHelper.initialize({ logProcess: false });
    const withSingleQuoteRes = await dbHelper.select("'");
    const withDoubleQuoteRes = await dbHelper.select('"');
    const commonWordRes = await dbHelper.select('bot');
    const unexistentWordRes = await dbHelper.select('alhcwgauiwgd');
    expect(withSingleQuoteRes.token).toEqual("'");
    expect(withDoubleQuoteRes.token).toEqual('"');
    expect(commonWordRes.token).toEqual('bot');
    expect(unexistentWordRes).toEqual(undefined);
  });

  it('Open and closes the DB connection as expected', async () => {
    const dbHelper = new WEmbeddingsDBHelper('glove', 50, SUPPORTED_LOCALE);
    await dbHelper.initialize({ logProcess: false });
    dbHelper.close();
    expect(dbHelper.instance.open).toBe(false);
  });

  // it('Word embedding supported, needs to be downloaded', async () => {
  //   const dbHelper = new WEmbeddingsDBHelper('10k-fasttext', 300, 'ca');
  //   await dbHelper.initialize();
  //   expect(dbHelper.instance.open).toBe(true);
  //   expect(dbHelper.instance.readonly).toBe(true);
  // });
});
