const initCarrotquest = (apiKey) => {
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
        methods.forEach((method) => {
            window.carrotquest[method] = function () {
                window.carrotquestasync.push(method, arguments);
            };
        });
    }
    window.carrotquest.connect(apiKey);
};
const prepareUserProps = (props, propsMapping, operation = 'update_or_create') => {
    const defaultPropsMapping = {
        email: "$email",
        name: "$name",
        phone: "$phone",
    };
    const mapping = { ...defaultPropsMapping, ...propsMapping };
    return Object.keys(mapping)
        .map((key) => {
        if (typeof props[key] === "undefined") {
            return null;
        }
        return {
            op: operation,
            key: mapping[key],
            value: props[key],
        };
    })
        .filter((prop) => prop !== null);
};
const prepareEventProps = (props = {}, propsMapping) => {
    if (Object.keys(props).length === 0) {
        return null;
    }
    return Object.entries(props).reduce((acc, [key, value]) => {
        const newKey = propsMapping[key];
        if (newKey) {
            acc[newKey] = value;
        }
        return acc;
    }, {});
};
export default ({ apiKey, propsMapping, eventsMapping }) => ({
    name: "carrotquest",
    initialize: () => {
        if (apiKey) {
            initCarrotquest(apiKey);
        }
    },
    loaded: () => typeof window.carrotquest !== undefined,
    identify: ({ payload }) => {
        const { traits } = payload;
        const preparedProps = prepareUserProps(traits, propsMapping);
        if (preparedProps.length > 0) {
            window.carrotquest.identify(preparedProps);
        }
    },
    track: ({ payload }) => {
        const { event, properties } = payload;
        const eventName = eventsMapping[event];
        if (eventName) {
            const preparedProps = prepareEventProps(properties, propsMapping);
            window.carrotquest.track(eventName, preparedProps);
        }
    },
    methods: {
        auth: (userId, userHash) => {
            window.carrotquest.auth(userId, userHash);
        },
        deleteProps: (props) => {
            const normalizedProps = Object.fromEntries(props.map((prop) => [prop, null]));
            const preparedProps = prepareUserProps(normalizedProps, propsMapping, 'delete');
            window.carrotquest.identify(preparedProps);
        },
    },
});
