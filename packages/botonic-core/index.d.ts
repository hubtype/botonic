type StringMatcher = RegExp| string | ((data: string) => boolean);
type SessionMatcher = (session: any) => boolean;

export interface Route {
  path: StringMatcher;
  payload?: StringMatcher;
  text?: StringMatcher;
  type?: StringMatcher;
  intent?: StringMatcher;
  session?: SessionMatcher;
  action: React.ReactNode;
}

// handoff
export declare function humanHandOff(session: any, queue_name: string, on_finish: {payload?: any, path?: any}): Promise<void>;
export declare function getOpenQueues(session: any): Promise<{queues: string[]}>;
export declare function storeCaseRating(session: any, rating: number): Promise<any>;


// debug
export class RouteInspector {
  routeMatched(route: Route, routeKey: string, routeValue: StringMatcher | SessionMatcher, input: any): void;
}

export class LogRouteInspector extends RouteInspector {
}

