import { expectImgUrlIs } from './image.test';
import { testContentful, testContext } from './contentful.helper';
import * as cms from '../../src';

export const TEST_POST_FAQ1_ID = 'djwHOFKknJ3AmyG6YKNip';
const TEST_POST_FAQ2_ID = '22h2Vba7v92MadcL5HeMrt';
const TEST_FBK_OK_MSG = '63lakRZRu1AJ1DqlbZZb9O';
const TEST_SORRY = '6ZjjdrKQbaLNc6JAhRnS8D';
const TEST_TEXT_URL_BUTTON = '2N9HQ960BdUVlDDQjpTA6I';
const TEST_TEXT_IMAGE_FOLLOWUP = '35aCTbYevK13TAXqqCdY8t';
export const KEYWORDS_OK = 'GbIpKJu8kW6PqMGAUYkoS';
export const KEYWORDS_NOT_FOUND = '4C2ghzuNPXIl0KqLaq1Qqm';

test('TEST: contentful text without followup', async () => {
  const sut = testContentful();

  // act
  const text = await sut.text(TEST_SORRY, testContext()); // actually returns the fallback language (es)

  // assert
  expect(text.text).toEqual(
    'Siento no haber podido ayudarle, le invitamos a contactar con uno de nuestros agentes.'
  );
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].text).toEqual('Contactar con agente');
  expect(text.buttons[0].callback).toEqual(
    new cms.ContentCallback(cms.ModelType.TEXT, '3lzJqY4sI3VDgMRFsgvtvT')
  );
  expect(text.followUp).toBeUndefined();
});

test('TEST: contentful text with URL button with followup', async () => {
  const sut = testContentful();

  // act
  const ctx = testContext();
  const text = await sut.text(TEST_POST_FAQ1_ID, ctx);

  // assert
  expect(text.text).toEqual('Cómo encontrar su “pedido”\n' + '...');
  expect(text.common.shortText).toEqual(
    ctx && ctx.locale == 'en' ? 'Find my command' : 'Encontrar mi pedido'
  );
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].text).toEqual('Acceda a su cuenta');
  expect(text.buttons[0].callback.url).toEqual('https://shop.com/es/');
  expect(text.followUp).not.toBeUndefined();
});

test('TEST: contentful text with payload button', async () => {
  const sut = testContentful();

  // act
  const text = await sut.text(KEYWORDS_NOT_FOUND, testContext());

  // assert
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].callback.payload).toBe('humanHandOff');
});

test('TEST: contentful text without buttons with text followup', async () => {
  const sut = testContentful();

  // act
  const text = await sut.text(TEST_POST_FAQ2_ID, testContext());

  // assert
  expect(text.buttons).toHaveLength(0);
  expect((text.followUp as cms.Text).buttons).toHaveLength(2);
});

test('TEST: contentful text without buttons with carousel followup', async () => {
  const sut = testContentful();

  // act
  const text = await sut.text(TEST_FBK_OK_MSG, testContext());

  // assert
  expect(text.buttons).toHaveLength(0);
  expect((text.followUp as cms.Carousel).elements).toHaveLength(3);
});

test('TEST: contentful text without buttons with image followup', async () => {
  const sut = testContentful();

  // act
  const text = await sut.text(TEST_TEXT_IMAGE_FOLLOWUP, testContext());

  // assert
  expectImgUrlIs((text.followUp as cms.Image).imgUrl, 'red.jpg');
});

test('TEST: contentful text with URL button', async () => {
  const sut = testContentful();

  // act
  const text = await sut.text(TEST_TEXT_URL_BUTTON, { locale: 'en' });

  // assert
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].text).toEqual('Web de Hubtype');
  expect(text.buttons[0].callback).toEqual(
    cms.Callback.ofUrl('https://www.hubtype.com/en')
  );
});
