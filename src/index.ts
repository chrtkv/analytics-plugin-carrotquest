import { Config, CarrotquestMethod, CarrotquestEventProps, CarrotquestUserProps } from '@types'

const initCarrotquest = (apiKey: Config['apiKey']): void => {
  if (typeof window.carrotquest === 'undefined') {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://cdn.carrotquest.app/api.min.js'
    document.head.appendChild(script)

    window.carrotquest = {}
    window.carrotquestasync = []
    window.carrotquest.settings = {}

    const methods: CarrotquestMethod[] = [
      'connect', 'track', 'identify', 'auth', 'onReady',
      'addCallback', 'removeCallback', 'trackMessageInteraction',
    ]

    methods.forEach((method) => {
      window.carrotquest[method] = function () {
        window.carrotquestasync.push(method, arguments) // eslint-disable-line prefer-rest-params
      }
    })
  }

  window.carrotquest.connect(apiKey)
}

const prepareUserProps = (
  props: Record<string, string | boolean | number | null>,
  propsMapping: Record<string, string>,
  operation = 'update_or_create',
): CarrotquestUserProps[] => {
  const defaultPropsMapping: Record<string, string> = {
    email: '$email',
    name: '$name',
    phone: '$phone',
  }

  const mapping = { ...defaultPropsMapping, ...propsMapping }

  return Object.keys(mapping)
    .filter(key => propsMapping[key] !== undefined)
    .map((key: string): CarrotquestUserProps => ({
      op: operation,
      key: mapping[key],
      value: props[key],
    }))
}

const prepareEventProps = (
  props: Record<string, string | boolean | number | null> = {},
  propsMapping: Record<string, string>,
): CarrotquestEventProps => {
  if (Object.keys(props).length === 0) {
    return {}
  }

  return Object.entries(props).reduce((acc: CarrotquestEventProps, [key, value]) => {
    const newKey = propsMapping[key]
    if (newKey) {
      acc[newKey] = value
    }
    return acc
  }, {})
}

export default ({ apiKey, enabled, userPropsMapping = {}, eventPropsMapping = {}, eventsMapping = {} }: Config) => ({
  name: 'carrotquest',

  initialize: (): void => {
    if (apiKey && enabled) {
      initCarrotquest(apiKey)
    }
  },

  loaded: (): boolean => typeof window.carrotquest !== 'undefined',

  identify: ({ payload }: {
    payload: {
      userId: string
      traits: Record<string, string | boolean | number>
    }
  }): void => {
    const { traits } = payload
    const preparedProps = prepareUserProps(traits, userPropsMapping)

    if (preparedProps.length > 0) {
      window.carrotquest.identify(preparedProps)
    }
  },

  track: ({ payload }: {
    payload: {
      event: string
      properties?: Record<string, string | boolean | number>
    }
  }): void => {
    const { event, properties } = payload
    const eventName = eventsMapping[event]

    if (eventName) {
      const preparedProps = prepareEventProps(properties, eventPropsMapping)
      window.carrotquest.track(eventName, preparedProps)
    }
  },

  methods: {
    auth: (userId: string, userHash: string): void => {
      if (!window.carrotquest) {
        return
      }
      window.carrotquest.auth(userId, userHash)
    },

    deleteProps: (props: string[]): void => {
      const normalizedProps = Object.fromEntries(props.map(prop => [prop, null]))
      const preparedProps = prepareUserProps(normalizedProps, userPropsMapping, 'delete')
      window.carrotquest.identify(preparedProps)
    },
  },
})
