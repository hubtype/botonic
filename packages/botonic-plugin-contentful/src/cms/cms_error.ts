import { CallbackMap } from './callback';
import { CMS, ModelType } from './cms';
import { Carousel, ContentWithKeywords, Text, Url } from './model';
import * as time from '../time/schedule';

export class ErrorReportingCMS implements CMS {
  constructor(readonly cms: CMS) {}

  carousel(id: string, callbacks?: CallbackMap): Promise<Carousel> {
    return this.cms
      .carousel(id, callbacks)
      .catch(this.handleError(ModelType.CAROUSEL, id));
  }

  text(id: string, callbacks?: CallbackMap): Promise<Text> {
    return this.cms
      .text(id, callbacks)
      .catch(this.handleError(ModelType.TEXT, id));
  }

  url(id: string): Promise<Url> {
    return this.cms.url(id).catch(this.handleError(ModelType.URL, id));
  }

  contentsWithKeywords(): Promise<ContentWithKeywords[]> {
    return this.cms
      .contentsWithKeywords()
      .catch(this.handleError('textsWithKeywords'));
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
}
