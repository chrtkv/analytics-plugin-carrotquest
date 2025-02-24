export interface CarrotquestOptions {
  apiKey: string;
  propsMapping?: Record<string, string>;
  eventsMapping?: Record<string, string>;
}

export interface CarrotquestUserProp {
  op: string;
  key: string;
  value: string | boolean | number | null;
}

export type CarrotquestMethods = 'connect' | 'track' | 'identify' | 'auth' | 'onReady' | 'addCallback' | 'removeCallback' | 'trackMessageInteraction';

declare global {
  interface Window {
    carrotquest: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    carrotquestasync: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}
