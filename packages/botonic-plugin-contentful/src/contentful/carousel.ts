import * as contentful from 'contentful';
import { DeliveryWithFollowUp } from './followUp';
import { ButtonDelivery } from './button';
import * as cms from '../cms/cms';
import * as model from '../cms/model';
import { DeliveryApi, ContentWithKeywordsFields } from './deliveryApi';

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
  ): Promise<model.Carousel> {
    let entry: contentful.Entry<
      CarouselFields
    > = await this.delivery.getEntryByIdOrName(id, cms.ModelType.CAROUSEL);
    let elements = entry.fields.elements.map(async entry => {
      return this.elementFromEntry(entry, callbacks);
    });
    const cwk = DeliveryApi.buildContentWithKeywords(entry);
    let e = await Promise.all(elements);
    return new model.Carousel(cwk.name, e, cwk.shortText, cwk.keywords);
  }

  /**
   * @todo support multiple buttons
   */
  private async elementFromEntry(
    entry: contentful.Entry<ElementFields>,
    callbacks: cms.CallbackMap
  ): Promise<model.Element> {
    let fields = entry.fields;
    let buttonsPromises = entry.fields.buttons.map(reference =>
      this.button.fromReference(reference, callbacks)
    );

    return Promise.all(buttonsPromises).then(
      buttons =>
        new model.Element(
          buttons,
          fields.title,
          fields.subtitle,
          fields.pic && 'https:' + fields.pic.fields.file.url
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
