import { ButtonsWithKeywords } from './cms';
import { KeywordsParser } from './nlp/keywords';
import Contentful from './contentful';
import * as cms from './cms';
import { Renderer } from './render';

// Exports
export * from './cms';
export * from './render';

export default class BotonicPluginContentful {
  readonly cms: cms.CMS;

  readonly renderer: Renderer;

  constructor(options: any) {
    if (options.cms) {
      this.cms = options.cms;
    } else {
      this.cms = new Contentful(options.spaceId, options.accessToken);
    }
    this.cms = new cms.ErrorReportingCMS(this.cms);
    this.renderer = options.renderer || new Renderer();
  }

  async suggestTextsForInput(
    inputText: string,
    textId: string
  ): Promise<cms.Text> {
    // TODO call in parallel
    let template = await this.cms.text(textId, new cms.CallbackMap());
    let allButtons = await this.cms.textsWithKeywordsAsButtons();
    let kws = new KeywordsParser<ButtonsWithKeywords>();
    allButtons.forEach(but => kws.addCandidate(but, but.keywords));
    let matches = kws.findCandidatesWithKeywordsAt(inputText);
    let buttons = matches.map(match => match.button);
    return new cms.Text(template.name, template.text, buttons);
  }

  // @ts-ignore
  async pre({ input, session, lastRoutePath }) {
    return { input, session, lastRoutePath };
  }

  // @ts-ignore
  async post({ input, session, lastRoutePath, response }) {
    return { input, session, lastRoutePath, response };
  }
}
