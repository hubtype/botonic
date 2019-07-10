export type Locales = {[id: string]: string|string[]|Locales };

export interface Input {
  type: string; // text, postback...
  payload?: string;
  data?: string;
}

type StringMatcher = RegExp| string | ((data: string) => boolean);

export interface Session {
  is_first_interaction?: boolean,
  last_session?: any,
  user: {
    id: string
    // login
    username?: string,
    // person name
    name?: string,
    // whatsapp, telegram,...
    provider?: string,
    // The provider's user id
    provider_id?: string,
    extra_data?: any
  },
  bot: {
    id: string,
    name?: string
  }
  __locale?: string,
  __retries?: number
}

export interface Route {
  path: StringMatcher;
  payload?: StringMatcher;
  text?: StringMatcher;
  type?: StringMatcher;
  intent?: StringMatcher;
  session?: (session: Session) => boolean;
  action: React.ReactNode;
}

// Desk
export declare function humanHandOff(session: Session, queue_name: string, on_finish: {payload?: any, path?: any}): Promise<void>;
export declare function getOpenQueues(session: Session): Promise<{queues: string[]}>;
export declare function storeCaseRating(session: Session, rating: number): Promise<any>;

export class CoreBot {

  constructor(_ : {
      routes: Route[],
      locales: Locales,
      integrations?: {[id: string]: any},
      theme?: string,
      plugins?: { [id: string]: any},
      appId?: string,
      defaultTyping?: number,
      defaultDelay?: number
    });

  getString(stringID: string, session: Session): string;

  setLocale(locale: string, session: Session): void;

  input(_: {input: Input, session?: Session, lastRoutePath: string}): {
    input: Input,
    response: React.ReactNode,
    session: Session,
    lastRoutePath: string};
}
