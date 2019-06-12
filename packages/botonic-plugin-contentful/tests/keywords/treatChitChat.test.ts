import 'jest-extended';
import { Callback } from '../../src/cms';
import {
  chitchatContent,
  contentWithKeyword,
  keywordsWithMockCms
} from './suggestTextsForInput.test';

test.each<any>([
  //@bug it recognizes only 1 chitchat because both keywords belong to same content
  //['buenos dias como esta no_reconocido no_reconocido!', 2],
  ['buenos dias hasta luego no_reconocido no_reconocido!', 2],
  ['hola adios no_reconocido', 2],
  ['hola no_reconocido', 1],
  ['hola adios no_reconocido no_reconocido', 2]
])(
  'TEST treatChitChat(%s): only filtered keywords, plus aprox <=2 non recognized tokens',
  async (inputText: string, numChitchats: number) => {
    let keywords = keywordsWithMockCms([
      chitchatContent(['hola', 'buenos dias']),
      chitchatContent(['adios', 'hasta luego'])
    ]);
    let tokens = keywords.tokenize(inputText);
    let contents = await keywords.searchContentsFromInput(tokens);
    expect(contents).toHaveLength(numChitchats);

    // act
    let filtered = keywords.filterChitchat(tokens, contents);

    // assert
    expect(filtered).toHaveLength(1);
    filtered.forEach(filtered => {
      expect(filtered.getCallbackIfChitchat()).not.toBeUndefined();
    });
  }
);

test('TEST treatChitChat: chitchat and other keywords detected', async () => {
  let keywords = keywordsWithMockCms([
    chitchatContent(['hola', 'buenos dias']),
    contentWithKeyword(Callback.ofPayload('payload'), ['devolucion'])
  ]);
  let tokens = keywords.tokenize('hola, DevoluciON fuera de  plazo?');
  let parsedKeywords = await keywords.searchContentsFromInput(tokens);
  expect(parsedKeywords).toHaveLength(2);

  // act
  let filtered = keywords.filterChitchat(tokens, parsedKeywords);

  // assert
  expect(filtered).toHaveLength(1);
  expect(filtered[0].getCallbackIfChitchat()).toBeUndefined();
});

test.each<any>([
  //@bug it recognizes only 1 chitchat because both keywords belong to same content
  //['buenos dias como esta no_reconocido no_reconocido no_reconocido!', 2],
  ['buenos dias hasta luego no_reconocido no_reconocido no_reconocido!', 2],
  ['hola no_reconocido no_reconocido no_reconocido no_reconocido', 1],
  ['hola asdhas sad asd dsa', 1]
])(
  'TEST treatChitChat: chitchats detected, plus aprox >2 non recognized tokens => ask user to repeat',
  async (inputText: string, numChitChats: number) => {
    let keywords = keywordsWithMockCms([
      chitchatContent(['hola', 'buenos dias']),
      chitchatContent(['hasta luego'])
    ]);
    let tokens = keywords.tokenize(inputText);

    let contents = await keywords.searchContentsFromInput(tokens);
    expect(contents).toHaveLength(numChitChats);

    // act
    let filtered = keywords.filterChitchat(tokens, contents);

    // assert
    expect(filtered).toEqual([]);
  }
);

test('TEST treatChitChat: no chitchat detected', async () => {
  let keywords = keywordsWithMockCms([
    chitchatContent(['hola']),
    contentWithKeyword(Callback.ofPayload('payload'), ['devolucion'])
  ]);

  let tokens = keywords.tokenize('DevoluciON fuera de  plazo');
  let contents = await keywords.searchContentsFromInput(tokens);
  expect(contents).toHaveLength(1);

  // act
  let filtered = keywords.filterChitchat(tokens, contents);

  // assert
  expect(filtered).toBe(contents);
});
