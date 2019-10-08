import * as cms from './cms';
import Contentful from './contentful';
import { KeywordsOptions, Normalizer, StemmingBlackList } from './nlp';
import { Search } from './search';
import { BotonicMsgConverter } from './render';

interface NlpOptions {
  blackList: { [locale: string]: StemmingBlackList[] };
}

interface OptionsBase {
  renderer?: BotonicMsgConverter;
  search?: Search;
  nlpOptions?: NlpOptions;
  keywordsOptions?: { [locale: string]: KeywordsOptions };
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

  constructor(opt: CmsOptions | ContentfulOptions) {
    const optionsAny = opt as any;
    if (optionsAny.cms) {
      this.cms = optionsAny.cms;
    } else {
      const contOptions = opt as ContentfulOptions;
      this.cms = new Contentful(contOptions.spaceId, contOptions.accessToken);
    }
    this.cms = new cms.ErrorReportingCMS(this.cms);
    this.renderer = opt.renderer || new BotonicMsgConverter();

    if (opt.search) {
      this.search = opt.search;
    } else {
      const normalizer = opt.nlpOptions
        ? new Normalizer(opt.nlpOptions.blackList)
        : new Normalizer();
      this.search = new Search(this.cms, normalizer, opt.keywordsOptions);
    }
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
