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
