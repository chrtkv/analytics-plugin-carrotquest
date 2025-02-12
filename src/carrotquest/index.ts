import carrotquest from ".";
import { CarrotquestOptions, CarrotquestMethods } from "@/types/carrotquest";

const initCarrotquest = (appId: string): void => {
  if (typeof window.carrotquest === "undefined") {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://cdn.carrotquest.app/api.min.js";
    document.head.appendChild(script);

    window.carrotquest = {};
    window.carrotquestasync = [];
    window.carrotquest.settings = {};

    const methods: CarrotquestMethods[] = [
      "connect", "track", "identify", "auth", "onReady", 
      "addCallback", "removeCallback", "trackMessageInteraction"
    ];
    
    methods.forEach(method => {
      window.carrotquest[method] = function(...args: any[]) {
        window.carrotquestasync.push([method, ...args]);
      };
    });
  }
  
  if (appId) {
    window.carrotquest.connect(appId);
  }
};

export default ({ appId, userId, userHash }: CarrotquestOptions): any => ({
  name: "carrotquest",

  initialize: (): void => {
    if (appId) {
      initCarrotquest(appId);
    }
  },
  // identify,
  // track,
  methods: {
    auth: () => {
      window.carrotquest.auth(userId, userHash);
      console.log('Run auth');
    },
  },
});
