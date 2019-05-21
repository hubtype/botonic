type StringMatcher = RegExp| string | ((data: string) => boolean);

export interface Route {
  path: StringMatcher;
  payload?: StringMatcher;
  text?: StringMatcher;
  type?: StringMatcher;
  intent?: StringMatcher;
  session?: (session: any) => boolean;
  action: React.ReactNode;
}

// handoff
export declare function humanHandOff(session: any, queue_name: string, on_finish: {payload?: any, path?: any}): Promise<void>;
export declare function getOpenQueues(session: any): Promise<{queues: string[]}>;
export declare function storeCaseRating(session: any, rating: number): Promise<any>;


export declare function storeCaseRating(session: any, rating: number): Promise<void>;
