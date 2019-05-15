export interface Route {
  path: string;
  payload?: RegExp| string | ((input: string) => boolean);
  text?: RegExp | string | ((input: string) => boolean);
  action: React.ReactNode;
}

export declare function humanHandOff(session: any, queue_name: string, on_finish: {payload?: any, path?: any}): Promise<void>;

export declare function getOpenQueues(session: any): Promise<{queues: string[]}>;
