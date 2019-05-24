import { KEYWORDS_NOT_FOUND, KEYWORDS_OK } from '../contentful/text.test';
import { testContentful } from '../contentful/contentful.helper';
import { Keywords } from '../../src/keywords';
import 'jest-extended';

test.each<any>([
  //@bug it recognizes only 1 chitchat
  //['buenos dias como esta no_reconocido no_reconocido!', 2],
  ['buenos dias hasta luego no_reconocido no_reconocido!', 2],
  ['hola adios no_reconocido', 2],
  ['hola no_reconocido', 1],
  ['hola adios no_reconocido no_reconocido', 2]
])(
  'TEST treatChitChat(%s): %d chitchat keywords , plus aprox <=2 non recognized tokens',
  async (inputText: string, numChitChats: number) => {
    let sut = testContentful();

    let keywords = new Keywords(sut);
    let tokens = keywords.tokenize(inputText);
    let textWithButtons = await keywords.suggestTextsForInput(
      tokens,
      KEYWORDS_OK,
      KEYWORDS_NOT_FOUND
    );
    expect(textWithButtons.buttons).toHaveLength(numChitChats);

    // act
    let chitchat = await keywords.treatChitChat(tokens, textWithButtons, [
      'chitchat'
    ]);

    // assert
    expect(chitchat!.shortText).toEqual('chitchat');
    expect(chitchat!.buttons).toHaveLength(0);
  }
);

test('TEST treatChitChat: chitchat and other keywords detected', async () => {
  let sut = testContentful();

  let keywords = new Keywords(sut);
  let tokens = keywords.tokenize('hola, DevoluciON fuera de  plazo?');

  let textWithButtons = await keywords.suggestTextsForInput(
    tokens,
    KEYWORDS_OK,
    KEYWORDS_NOT_FOUND
  );
  expect(textWithButtons.buttons).toHaveLength(3);

  // act
  let chitchat = await keywords.treatChitChat(tokens, textWithButtons, [
    'chitchat'
  ]);

  // assert
  expect(chitchat!.shortText).not.toEqual('chitchat');
  expect(chitchat!.buttons).toHaveLength(2);
});

test.each<any>([
  //@bug it recognizes only 1 chitchat
  //['buenos dias como esta no_reconocido no_reconocido no_reconocido!', 2],
  ['buenos dias hasta luego no_reconocido no_reconocido no_reconocido!', 2],
  ['hola no_reconocido no_reconocido no_reconocido no_reconocido', 1],
  ['hola asdhas sad asd dsa', 1]
])(
  'TEST treatChitChat: chitchats detected , plus aprox >2 non recognized tokens => RETRY',
  async (inputText: string, numChitChats: number) => {
    let sut = testContentful();

    let keywords = new Keywords(sut);
    let tokens = keywords.tokenize(inputText);

    let textWithButtons = await keywords.suggestTextsForInput(
      tokens,
      KEYWORDS_OK,
      KEYWORDS_NOT_FOUND
    );
    expect(textWithButtons.buttons).toHaveLength(numChitChats);

    // act
    let chitchat = await keywords.treatChitChat(tokens, textWithButtons, [
      'chitchat'
    ]);

    // assert
    expect(chitchat).toBeUndefined();
  }
);

test('TEST treatChitChat: no chitchat detected', async () => {
  let sut = testContentful();

  let keywords = new Keywords(sut);
  let tokens = keywords.tokenize('DevoluciON fuera de  plazo?');

  let textWithButtons = await keywords.suggestTextsForInput(
    tokens,
    KEYWORDS_OK,
    KEYWORDS_NOT_FOUND
  );
  expect(textWithButtons.buttons).toHaveLength(2);

  // act
  let chitchat = await keywords.treatChitChat(tokens, textWithButtons, [
    'chitchat'
  ]);

  // assert
  expect(chitchat).toBe(textWithButtons);
});
