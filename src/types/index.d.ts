export interface Config {
  apiKey: string
  enabled?: boolean
  userPropsMapping?: Record<string, string>
  eventPropsMapping?: Record<string, string>
  eventsMapping?: Record<string, string>
}

export interface CarrotquestUserProps {
  op: string
  key: string
  value: string | boolean | number | null
}

export type CarrrotquestEventProps = Record<string, string | boolean | number | null>

export type CarrotquestMethod = 'connect' | 'track' | 'identify' | 'auth' | 'onReady' | 'addCallback' | 'removeCallback' | 'trackMessageInteraction'

declare global {
  interface Window {
    carrotquest: {
      [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
      settings?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    }
    carrotquestasync: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}
