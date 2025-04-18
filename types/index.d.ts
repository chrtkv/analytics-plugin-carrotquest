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

export type CarrotquestEventProps = Record<string, string | boolean | number | null>

export type CarrotquestMethod = 'connect' | 'track' | 'identify' | 'auth' | 'onReady' | 'addCallback' | 'removeCallback' | 'trackMessageInteraction'

interface CarrotquestMethods {
  connect(apiKey: string): void
  track(eventName: string, props?: CarrotquestEventProps): void
  identify(userProps: CarrotquestUserProps[]): void
  auth(userId: string, userHash: string): void
  onReady(callback: () => void): void
  addCallback(event: string, callback: (...args: unknown[]) => void): void
  removeCallback(event: string): void
  trackMessageInteraction(messageId: string): void
  settings: Record<string, unknown>
}

declare global {
  interface Window {
    // Main Carrotquest object with required methods
    carrotquest: {
      connect(apiKey: string): void
      track(eventName: string, props?: CarrotquestEventProps): void
      identify(userProps: CarrotquestUserProps[]): void
      auth(userId: string, userHash: string): void
      onReady(callback: () => void): void
      addCallback(event: string, callback: (...args: unknown[]) => void): void
      removeCallback(event: string): void
      trackMessageInteraction(messageId: string): void
      settings: Record<string, unknown>
    }
    // Queue of calls before the script is loaded
    carrotquestasync: unknown[]
  }
}
