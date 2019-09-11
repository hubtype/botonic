import * as cms from './cms';
import Contentful from './contentful';
import { StemmingEscaper } from './nlp/node-nlp';
import { Search } from './search';
import { BotonicMsgConverter } from './render';

interface OptionsBase {
  renderer?: BotonicMsgConverter;
  search?: Search;
  stemming?: {
    /** @see StemmingEscaper */
    blackList: string[][];
  };
}

export interface CmsOptions extends OptionsBase {
  cms?: cms.CMS;
}

export interface ContentfulOptions extends OptionsBase {
  spaceId: string;
  accessToken: string;
}

export default class BotonicPluginContentful {
  readonly cms: cms.CMS;

  readonly renderer: BotonicMsgConverter;

  readonly search: Search;

  constructor(options: CmsOptions | ContentfulOptions) {
    const optionsAny = options as any;
    if (optionsAny.cms) {
      this.cms = optionsAny.cms;
    } else {
      const contOptions = options as ContentfulOptions;
      this.cms = new Contentful(contOptions.spaceId, contOptions.accessToken);
    }
    this.cms = new cms.ErrorReportingCMS(this.cms);
    this.renderer = options.renderer || new BotonicMsgConverter();

    const blackList = options.stemming ? options.stemming.blackList : [];
    const escaper = new StemmingEscaper(blackList);
    this.search = options.search || new Search(this.cms, escaper);
  }

  // @ts-ignore
  pre({ input, session, lastRoutePath }) {
    return { input, session, lastRoutePath };
  }

  // @ts-ignore
  post({ input, session, lastRoutePath, response }) {
    return { input, session, lastRoutePath, response };
  }
}
