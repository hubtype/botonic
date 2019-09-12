import * as cms from './cms';
import Contentful from './contentful';
import { KeywordsOptions } from './nlp/keywords';
import { StemmingEscaper } from './nlp/node-nlp';
import { Tokenizer } from './nlp/tokens';
import { Search } from './search';
import { BotonicMsgConverter } from './render';

interface OptionsBase {
  renderer?: BotonicMsgConverter;
  search?: Search;
  searchOptions?: {
    /** @see StemmingEscaper */
    blackList: string[][];
    keywords: KeywordsOptions;
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
      const blackList = opt.searchOptions ? opt.searchOptions.blackList : [];
      const keywords = opt.searchOptions
        ? opt.searchOptions.keywords
        : new KeywordsOptions();
      const escaper = new StemmingEscaper(blackList);
      this.search = new Search(this.cms, new Tokenizer(escaper), keywords);
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
