import { SearchResult } from '../search/search-result';
import { CallbackMap } from './callback';
import { CMS, ModelType } from './cms';
import {
  Asset,
  Carousel,
  Text,
  Url,
  Image,
  Chitchat,
  Queue,
  Content
} from './contents';
import * as time from '../time';

export class ErrorReportingCMS implements CMS {
  constructor(readonly cms: CMS) {}

  private validate<C extends Content>(content: C): C {
    let v = content.validate();
    if (v) {
      console.error(v);
    }
    return content;
  }

  carousel(id: string, callbacks?: CallbackMap): Promise<Carousel> {
    return this.cms
      .carousel(id, callbacks)
      .catch(this.handleError(ModelType.CAROUSEL, id))
      .then(this.validate);
  }

  text(id: string, callbacks?: CallbackMap): Promise<Text> {
    return this.cms
      .text(id, callbacks)
      .catch(this.handleError(ModelType.TEXT, id))
      .then(this.validate);
  }

  chitchat(id: string, callbacks?: CallbackMap): Promise<Chitchat> {
    return this.cms
      .text(id, callbacks)
      .catch(this.handleError(ModelType.CHITCHAT, id))
      .then(this.validate);
  }

  url(id: string): Promise<Url> {
    return this.cms
      .url(id)
      .catch(this.handleError(ModelType.URL, id))
      .then(this.validate);
  }

  image(id: string): Promise<Image> {
    return this.cms
      .image(id)
      .catch(this.handleError(ModelType.IMAGE, id))
      .then(this.validate);
  }

  queue(id: string): Promise<Queue> {
    return this.cms
      .queue(id)
      .catch(this.handleError(ModelType.QUEUE, id))
      .then(this.validate);
  }

  contentsWithKeywords(): Promise<SearchResult[]> {
    return this.cms
      .contentsWithKeywords()
      .catch(this.handleError('contentsWithKeywords'));
  }

  private handleError(modelType: string, id?: string): (reason: any) => never {
    return (reason: any) => {
      let withId = id ? ` with id '${id}'` : '';
      if (reason.response && reason.response.data) {
        reason =
          reason.response.status + ': ' + JSON.stringify(reason.response.data);
      }
      // eslint-disable-next-line no-console
      console.error(`Error fetching ${modelType}${withId}: ${reason}`);
      throw reason;
    };
  }

  schedule(id: string): Promise<time.Schedule> {
    return this.cms
      .schedule(id)
      .catch(this.handleError(ModelType.SCHEDULE, id));
  }

  dateRange(id: string): Promise<time.DateRange> {
    return this.cms
      .dateRange(id)
      .catch(this.handleError(ModelType.DATE_RANGE, id));
  }

  asset(id: string): Promise<Asset> {
    return this.cms.asset(id).catch(this.handleError(ModelType.ASSET, id));
  }

  contents(model: ModelType): Promise<Content[]> {
    return this.cms.contents(model).catch(this.handleError('contents'));
  }
}
