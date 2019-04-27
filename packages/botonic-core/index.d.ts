export interface Route {
  path: string;
  payload?: RegExp| string;
  text?: string;
  action: React.ReactNode;
}
