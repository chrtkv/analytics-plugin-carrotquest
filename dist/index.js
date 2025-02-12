"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initCarrotquest = (appId) => {
    if (typeof window.carrotquest === "undefined") {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://cdn.carrotquest.app/api.min.js";
        document.head.appendChild(script);
        window.carrotquest = {};
        window.carrotquestasync = [];
        window.carrotquest.settings = {};
        const methods = [
            "connect", "track", "identify", "auth", "onReady",
            "addCallback", "removeCallback", "trackMessageInteraction"
        ];
        methods.forEach(method => {
            window.carrotquest[method] = function (...args) {
                window.carrotquestasync.push([method, ...args]);
            };
        });
    }
    if (appId) {
        window.carrotquest.connect(appId);
    }
};
exports.default = ({ appId, userId, userHash }) => ({
    name: "carrotquest",
    initialize: () => {
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
