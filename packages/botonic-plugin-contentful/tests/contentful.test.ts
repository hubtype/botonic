import { Contentful } from '../src/contentful/contentful';
import { mock } from 'ts-mockito';
import * as cms from '../src';

test('TEST: contentful', async () => {
  // // Massimo
  let c = new Contentful(
    'c6yifkuc6gv8',
    'cdce543064355bfbe80585e4d603776d6e2ec0f213f7395d3cc7c74ce7ef6cad',
    2000
  );
  // act
  let callback = mock(cms.Callback);
  let rm = await c.element(
    '714AB6c5NZoHLku5NoYVPE',
    cms.CallbackMap.forAllIds(callback)
  );

  // assert
  expect(rm.title).toBe('Dudas previas a la compra');
  expect(rm.subtitle).toBe(
    'Le ayudaré con sus compras en la tienda online de Massimo Dutti.'
  );
  expect(rm.imgUrl).toBe(
    'https://images.ctfassets.net/c6yifkuc6gv8/4yiuNsEcnINqDEfNEX2Ap2/84f81b12f0e0cd328a76bdc38db82f3c/img_01_comprar_new.png'
  );
  expect(rm.buttons).toHaveLength(1);
  expect(rm.buttons[0].callback.payload).toBe('714AB6c5NZoHLku5NoYVPE');
  expect(rm.buttons[0].text).toBe('Ver opciones');
});
