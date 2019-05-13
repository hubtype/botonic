import { testContentful } from './contentful.helper';
import { mock } from 'ts-mockito';
import * as cms from '../../src';

const TEST_CAROUSEL_MAIN_ID = '2yR9f3stNAEqdamUr8VtfD';

function assertElementDudasPrevias(element: cms.Element) {
  expect(element.title).toBe('Dudas previas a la compra');
  expect(element.subtitle).toBe(
    'Le ayudaré con sus compras en la tienda online de Massimo Dutti.'
  );
  let urlChunks = element.imgUrl!.split('/');
  expect(urlChunks[0]).toBe('https:');
  expect(urlChunks[urlChunks.length - 1]).toBe('img_01_comprar_new.png');
  expect(element.buttons).toHaveLength(1);
  expect(element.buttons[0].callback.payload).toBe(
    'text$79aRfznNCyN2VGdGDQZBf3'
  );
  expect(element.buttons[0].text).toBe('Ver opciones');
}

test('TEST: contentful carousel', async () => {
  let sut = testContentful();
  let callback = mock(cms.Callback);

  // act
  let carousel = await sut.carousel(
    TEST_CAROUSEL_MAIN_ID,
    cms.CallbackMap.forAllIds(callback)
  );

  // assert
  expect(carousel.elements).toHaveLength(3);
  assertElementDudasPrevias(carousel.elements[0]);
});
