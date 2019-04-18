import { Contentful } from '../src/contentful/contentful';
import { mock } from 'ts-mockito';
import * as cms from '../src';

const MASSIMO_MAIN_CAROUSEL_ID = '2yR9f3stNAEqdamUr8VtfD';

function massimoContentful(): Contentful {
  return new Contentful(
    'c6yifkuc6gv8',
    'cdce543064355bfbe80585e4d603776d6e2ec0f213f7395d3cc7c74ce7ef6cad',
    2000
  );
}

function assertElementDudasPrevias(element: cms.Element) {
  expect(element.title).toBe('Dudas previas a la compra');
  expect(element.subtitle).toBe(
    'Le ayudaré con sus compras en la tienda online de Massimo Dutti.'
  );
  expect(element.imgUrl).toBe(
    'https://images.ctfassets.net/c6yifkuc6gv8/4yiuNsEcnINqDEfNEX2Ap2/84f81b12f0e0cd328a76bdc38db82f3c/img_01_comprar_new.png'
  );
  expect(element.buttons).toHaveLength(1);
  expect(element.buttons[0].callback.payload).toBe(MASSIMO_MAIN_CAROUSEL_ID);
  expect(element.buttons[0].text).toBe('Ver opciones');
}

test('TEST: contentful element', async () => {
  let sut = massimoContentful();
  let callback = mock(cms.Callback);

  // act
  let element = await sut.element(
    '714AB6c5NZoHLku5NoYVPE',
    cms.CallbackMap.forAllIds(callback)
  );

  // assert
  assertElementDudasPrevias(element);
});

test('TEST: contentful carousel', async () => {
  let sut = massimoContentful();
  let callback = mock(cms.Callback);

  // act
  let carousel = await sut.carousel(
    MASSIMO_MAIN_CAROUSEL_ID,
    cms.CallbackMap.forAllIds(callback)
  );

  // assert
  expect(carousel.elements).toHaveLength(1);
  assertElementDudasPrevias(carousel.elements[0]);
});
