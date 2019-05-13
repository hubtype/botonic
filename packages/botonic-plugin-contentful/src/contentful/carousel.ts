import * as contentful from 'contentful';
import { DeliveryWithFollowUp } from './followUp';
import { ButtonDelivery } from './button';
import * as cms from '../cms/cms';
import * as model from '../cms/model';
import { DeliveryApi } from './deliveryApi';

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
    return new model.Carousel(entry.fields.name, await Promise.all(elements));
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

export interface CarouselFields {
  name: string;
  elements: contentful.Entry<ElementFields>[];
}
