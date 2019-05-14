export interface Route {
  path: string;
  payload?: RegExp| string | ((input: string) => boolean);
  text?: RegExp | string | ((input: string) => boolean);
  action: React.ReactNode;
}
