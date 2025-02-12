export type CarrotquestOptions = {
  appId: string;
  userId?: string;
  userHash?: string;
};

export type CarrotquestMethods = "connect" | "track" | "identify" | "auth" | "onReady" | "addCallback" | "removeCallback" | "trackMessageInteraction";

declare global {
  interface Window {
    carrotquest: any;
    carrotquestasync: any;
  }
}
