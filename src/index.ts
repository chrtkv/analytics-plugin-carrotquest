import { Config, CarrotquestMethod, CarrotquestEventProps, CarrotquestUserProps } from '../types'

const initCarrotquest = (apiKey: Config['apiKey']): void => {
  if (typeof window.carrotquest === 'undefined') {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://cdn.carrotquest.app/api.min.js'
    document.head.appendChild(script)

    // Initialize the queue of calls before the script is loaded
    window.carrotquestasync = []

    // Create a stub for the Carrotquest object with all methods and settings
    const stub: Partial<Window['carrotquest']> & { settings: Record<string, unknown> } = {
      settings: {},
    }
    const methods: CarrotquestMethod[] = [
      'connect',
      'track',
      'identify',
      'auth',
      'onReady',
      'addCallback',
      'removeCallback',
      'trackMessageInteraction',
    ]
    methods.forEach((method) => {
      stub[method] = (...args: unknown[]) => {
        // push two separate elements: method name and array of arguments
        window.carrotquestasync.push(method, args)
      }
    })
    window.carrotquest = stub as Window['carrotquest']
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

  loaded: (): boolean => {
    if (!enabled) {
      return false
    }
    return typeof window.carrotquest === 'object'
  },

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
