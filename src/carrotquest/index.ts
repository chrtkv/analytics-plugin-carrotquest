import { CarrotquestOptions, CarrotquestMethods, CarrotquestProp } from '@/types/carrotquest';

const initCarrotquest = (apiKey: string): void => {
  if (typeof window.carrotquest === 'undefined') {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://cdn.carrotquest.app/api.min.js';
    document.head.appendChild(script);

    window.carrotquest = {};
    window.carrotquestasync = [];
    window.carrotquest.settings = {};

    const methods: CarrotquestMethods[] = [
      'connect', 'track', 'identify', 'auth', 'onReady',
      'addCallback', 'removeCallback', 'trackMessageInteraction'
    ];

    methods.forEach((method) => {
      window.carrotquest[method] = function () {
        window.carrotquestasync.push(method, arguments);
      };
    });
  }

  window.carrotquest.connect(apiKey);
};

const prepareUserProps = (
  props: Record<string, string | boolean | number | null>,
  propsMapping: Record<string, string>,
  operation = 'update_or_create'
): CarrotquestProp[] => {
  const defaultPropsMapping: Record<string, string> = {
    email: '$email',
    name: '$name',
    phone: '$phone',
  };

  const mapping = { ...defaultPropsMapping, ...propsMapping };

  return Object.keys(mapping)
    .map((key: string): CarrotquestProp | null => {
      if (typeof props[key] === 'undefined') {
        return null;
      }

      return {
        op: operation,
        key: mapping[key],
        value: props[key],
      };
    })
    .filter((prop): prop is CarrotquestProp => prop !== null);
};

const prepareEventProps = (
  props: Record<string, string | boolean | number | null> = {},
  propsMapping: Record<string, string>
): Record<string, string | boolean | number | null> | null => {
  if (Object.keys(props).length === 0) {
    return null;
  }

  return Object.entries(props).reduce((acc, [key, value]) => {
    const newKey = propsMapping[key];
    if (newKey) {
      acc[newKey] = value;
    }
    return acc;
  }, {} as Record<string, string | boolean | number | null>);
};

export default ({ apiKey, propsMapping, eventsMapping }: CarrotquestOptions): object => ({
  name: 'carrotquest',

  initialize: (): void => {
    if (apiKey) {
      initCarrotquest(apiKey);
    }
  },

  loaded: (): boolean => typeof window.carrotquest !== 'undefined',

  identify: ({ payload }: {
    payload: {
      userId: string;
      traits: Record<string, string | boolean | number>;
    };
  }): void => {
    const { traits } = payload;
    const preparedProps = prepareUserProps(traits, propsMapping);

    if (preparedProps.length > 0) {
      window.carrotquest.identify(preparedProps);
    }
  },

  track: ({ payload }: {
    payload: {
      event: string;
      properties?: Record<string, string | boolean | number>;
    };
  }): void => {
    const { event, properties } = payload;
    const eventName = eventsMapping[event];

    if (eventName) {
      const preparedProps = prepareEventProps(properties, propsMapping);
      window.carrotquest.track(eventName, preparedProps);
    }
  },

  methods: {
    auth: (userId: string, userHash: string): void => {
      window.carrotquest.auth(userId, userHash);
    },

    deleteProps: (props: string[]): void => {
      const normalizedProps = Object.fromEntries(props.map((prop) => [prop, null]));
      const preparedProps = prepareUserProps(normalizedProps, propsMapping, 'delete');

      window.carrotquest.identify(preparedProps);
    },
  },
});
