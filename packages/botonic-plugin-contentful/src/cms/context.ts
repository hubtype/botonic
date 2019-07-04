import { CallbackMap } from './callback';

export type Locale = string;

/**
 * Default values when the context argument {@link Context} is not specified in a {@link CMS} call.
 */
export const DEFAULT_CONTEXT: Context = {};

export interface Context {
  locale?: Locale;
  callbacks?: CallbackMap;
}
