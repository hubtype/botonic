import { Renderer } from "./render/render";
import { Contentful } from "./contentful/contentful";

export { RichMessage } from './cms/model'
export { Button } from './cms/model'
export { Carousel } from './cms/model'

export { CMS } from './cms/cms'
export { Callback } from './cms/cms'

export { Contentful } from './contentful/contentful'

export { Renderer } from './render/render'

export default class BotonicPluginContentful {
  options: any;

  constructor(options: any) {
    this.options = options;
    let r = new Contentful();
  }

  async pre({ input, session, lastRoutePath }) {
    return { input, session, lastRoutePath };
  }

  async post({ input, session, lastRoutePath, response }) {
    return { input, session, lastRoutePath, response };
  }
}
