import * as contentful from 'contentful';
import { DeliveryWithFollowUp } from './follow-up';
import { ButtonDelivery } from './button';
import * as cms from '../cms';
import { DeliveryApi, ContentWithKeywordsFields } from './delivery-api';

// TODO remove DeliveryWithFollowUp
export class CarouselDelivery extends DeliveryWithFollowUp {
  constructor(
    protected delivery: DeliveryApi,
    readonly button: ButtonDelivery
  ) {
    super(delivery);
  }

  async carousel(
    id: string,
    callbacks: cms.CallbackMap
  ): Promise<cms.Carousel> {
    let entry: contentful.Entry<
      CarouselFields
    > = await this.delivery.getEntryByIdOrName(id, cms.ModelType.CAROUSEL);
    let elements = entry.fields.elements.map(async entry => {
      return this.elementFromEntry(entry, callbacks);
    });
    const cwk = DeliveryApi.buildContentWithKeywords(entry);
    let e = await Promise.all(elements);
    return new cms.Carousel(
      cwk.content.name,
      e,
      cwk.content.shortText,
      cwk.content.keywords
    );
  }

  /**
   * @todo support multiple buttons
   */
  private async elementFromEntry(
    entry: contentful.Entry<ElementFields>,
    callbacks: cms.CallbackMap
  ): Promise<cms.Element> {
    let fields = entry.fields;
    let buttonsPromises = entry.fields.buttons.map(reference =>
      this.button.fromReference(reference, callbacks)
    );

    return Promise.all(buttonsPromises).then(
      buttons =>
        new cms.Element(
          buttons,
          fields.title,
          fields.subtitle,
          fields.pic && DeliveryApi.urlFromAsset(fields.pic)
        )
    );
  }
}

interface ElementFields {
  title: string;
  subtitle: string;
  pic?: contentful.Asset;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any it's just a reference
  buttons: contentful.Entry<any>[];
}

export interface CarouselFields extends ContentWithKeywordsFields {
  elements: contentful.Entry<ElementFields>[];
}
