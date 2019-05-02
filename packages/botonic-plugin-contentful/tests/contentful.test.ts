import Contentful from '../src/contentful';
import { mock } from 'ts-mockito';
import * as cms from '../src';

const TEST_CAROUSEL_MAIN_ID = '2yR9f3stNAEqdamUr8VtfD';
const TEST_POST_FAQ1_ID = 'djwHOFKknJ3AmyG6YKNip';
const TEST_POST_FAQ2_ID = '22h2Vba7v92MadcL5HeMrt';
const TEST_URL_CUENTA_ID = '3ePsGfyLHBHsrxtU7IkPh9';
const TEST_FBK_OK_MSG = '63lakRZRu1AJ1DqlbZZb9O';
const TEST_SORRY = '6ZjjdrKQbaLNc6JAhRnS8D';

function testContentful(): Contentful {
  return new Contentful(
    process.env.CONTENTFUL_TEST_SPACE_ID!,
    process.env.CONTENTFUL_TEST_TOKEN!,
    2000
  );
}

function assertElementDudasPrevias(element: cms.Element) {
  expect(element.title).toBe('Dudas previas a la compra');
  expect(element.subtitle).toBe(
    'Le ayudaré con sus compras en la tienda online de Massimo Dutti.'
  );
  expect(element.imgUrl).toBe(
    'https://images.ctfassets.net/5wh7etpd1y84/4yiuNsEcnINqDEfNEX2Ap2/a1ba900b4bbaefe58a7483a6192ba360/img_01_comprar_new.png'
  );
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

test('TEST: contentful text without followup', async () => {
  let sut = testContentful();
  let callback = mock(cms.Callback);

  // act
  let text = await sut.text(TEST_SORRY, cms.CallbackMap.forAllIds(callback));

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
  let sut = testContentful();
  let callback = mock(cms.Callback);

  // act
  let text = await sut.text(
    TEST_POST_FAQ1_ID,
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
  let sut = testContentful();

  // act
  let text = await sut.text(TEST_POST_FAQ2_ID, new cms.CallbackMap());

  // assert
  expect(text.buttons).toHaveLength(0);
  expect((text.followup as cms.Text).buttons).toHaveLength(2);
});

test('TEST: contentful text without buttons with carousel followup', async () => {
  let sut = testContentful();

  // act
  let text = await sut.text(TEST_FBK_OK_MSG, new cms.CallbackMap());

  // assert
  expect(text.buttons).toHaveLength(0);
  expect((text.followup as cms.Carousel).elements).toHaveLength(3);
});

test('TEST: contentful url', async () => {
  let url = await testContentful().url(TEST_URL_CUENTA_ID);
  expect(url.url).toEqual('https://www.massimodutti.com/es/');
});

test('TEST: contentful text from model name', async () => {
  let sut = testContentful();
  let callback = mock(cms.Callback);

  // act
  let text = await sut.text(
    'PRE_MENU_CRSL',
    cms.CallbackMap.forAllIds(callback)
  );

  // assert
  expect(text.name).toEqual('PRE_MENU_CRSL');
  expect(text.buttons).toHaveLength(3);
});
