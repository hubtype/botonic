import Contentful from '../src/contentful';
import { mock } from 'ts-mockito';
import * as cms from '../src';

const MASSIMO_CAROUSEL_MAIN_ID = '2yR9f3stNAEqdamUr8VtfD';
const MASSIMO_POST_FAQ1_ID = 'djwHOFKknJ3AmyG6YKNip';
const MASSIMO_POST_FAQ2_ID = '22h2Vba7v92MadcL5HeMrt';
const MASSIMO_URL_CUENTA_ID = '3ePsGfyLHBHsrxtU7IkPh9';
const MASSIMO_GRACIAS = '63lakRZRu1AJ1DqlbZZb9O';
const MASSIMO_SORRY = '6ZjjdrKQbaLNc6JAhRnS8D';

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
  expect(element.buttons[0].callback.payload).toBe(
    'text$79aRfznNCyN2VGdGDQZBf3'
  );
  expect(element.buttons[0].text).toBe('Ver opciones');
}

test('TEST: contentful carousel', async () => {
  let sut = massimoContentful();
  let callback = mock(cms.Callback);

  // act
  let carousel = await sut.carousel(
    MASSIMO_CAROUSEL_MAIN_ID,
    cms.CallbackMap.forAllIds(callback)
  );

  // assert
  expect(carousel.elements).toHaveLength(2);
  assertElementDudasPrevias(carousel.elements[0]);
});

test('TEST: contentful text without followup', async () => {
  let sut = massimoContentful();
  let callback = mock(cms.Callback);

  // act
  let text = await sut.text(MASSIMO_SORRY, cms.CallbackMap.forAllIds(callback));

  // assert
  expect(text.text).toEqual(
    'Siento no haber podido ayudarle, le invitamos a contactar con uno de nuestros agentes.'
  );
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].text).toEqual('Contactar con agente');
  expect(text.buttons[0].callback.payload).not.toBeUndefined();
  expect(text.followup).toBeUndefined();
});

test('TEST: contentful text with URL button with followup', async () => {
  let sut = massimoContentful();
  let callback = mock(cms.Callback);

  // act
  let text = await sut.text(
    MASSIMO_POST_FAQ1_ID,
    cms.CallbackMap.forAllIds(callback)
  );

  // assert
  expect(text.text).toEqual(
    'Después de que se autorice el pago recibirá un correo electrónico con el número del pedido. A partir de este momento podrá consultar el estado de este en el apartado “Mis pedidos” directamente en su cuenta.\n' +
      'Una vez enviado, recibirá un correo electrónico de confirmación de salida de almacén que incluirá un enlace de seguimiento. Con este enlace podrá en todo momento saber la situación/ubicación.\n' +
      'Si ha realizado su compra con un perfil invitado, siga su pedido con el enlace que aparece en el email de confirmación. Si tiene otras dudas sobre la entrega del pedido, el equipo de Atención al Cliente está a su disposición.'
  );
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].text).toEqual('Acceda a su cuenta');
  expect(text.buttons[0].callback.url).toEqual(
    'https://www.massimodutti.com/es/'
  );
  expect(text.followup).not.toBeUndefined();
});

test('TEST: contentful text without buttons with text followup', async () => {
  let sut = massimoContentful();

  // act
  let text = await sut.text(MASSIMO_POST_FAQ2_ID, new cms.CallbackMap());

  // assert
  expect(text.buttons).toHaveLength(0);
  expect((text.followup as cms.Text).buttons).toHaveLength(2);
});

test('TEST: contentful text without buttons with carousel followup', async () => {
  let sut = massimoContentful();

  // act
  let text = await sut.text(MASSIMO_GRACIAS, new cms.CallbackMap());

  // assert
  expect(text.buttons).toHaveLength(0);
  expect((text.followup as cms.Carousel).elements).toHaveLength(2);
});

test('TEST: contentful url', async () => {
  let url = await massimoContentful().url(MASSIMO_URL_CUENTA_ID);
  expect(url.url).toEqual('https://www.massimodutti.com/es/');
});
