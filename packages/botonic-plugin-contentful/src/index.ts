import { Contentful } from './contentful/contentful';
import { CMS } from './cms';
import { Renderer } from './render';

// Exports
export * from './cms';
export * from './render';

export default class BotonicPluginContentful {
  readonly cms: CMS;

  readonly renderer: Renderer;

  constructor(options: any) {
    this.cms = new Contentful(options['spaceId'], options['accessToken']);
    this.renderer = new Renderer();
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
