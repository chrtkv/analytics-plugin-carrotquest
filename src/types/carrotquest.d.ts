export type CarrotquestOptions = {
  apiKey: string;
  propsMapping: { [key: string]: string };
  eventsMapping: { [key: string]: string };
};

export type CarrotquestProp = {
  op: string;
  key: string;
  value: string | boolean | number | null;
};

export type CarrotquestMethods = "connect" | "track" | "identify" | "auth" | "onReady" | "addCallback" | "removeCallback" | "trackMessageInteraction";

declare global {
  interface Window {
    carrotquest: any;
    carrotquestasync: any;
  }
}
