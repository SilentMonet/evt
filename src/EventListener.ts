import "reflect-metadata";
import { ComponentElement } from "./ComponentElement";

export enum EventsName {
  Event = "Event",
  ShadowEvent = "ShadowEvent",
  AttachShadow = "attachShadow",
  AttrChanged = "attrChanged",
}

interface ExtendableTarget {
  new(...args: any[]): ComponentElement<any>;
  readonly prototype: Object;
}
interface ListenerOptions extends AddEventListenerOptions {
  removeOnDisConnect?: boolean;
}
interface ListenersMap {
  [eventName: string]: {
    callbackName: string | number | symbol;
    options?: boolean | ListenerOptions;
  };
}

export function EventListener<T extends ExtendableTarget>(target: T) {
  return class EventListenerElement extends target {
    [callbackNames: string | symbol]: any;
    constructor(...args: any[]) {
      super(...args);
      const eventListeners: ListenersMap | undefined = Reflect.getMetadata(
        EventsName.Event,
        this
      );
      Object.entries(eventListeners || {}).forEach(([eventName, config]) => {
        const eventListener = (...args: any) =>
          this[config.callbackName](...args);
        this.addEventListener(eventName, eventListener, config.options);
        if (
          typeof config.options === "object" &&
          config.options.removeOnDisConnect
        ) {
          this.addEventListener("disconnected", () =>
            this.removeEventListener(eventName, eventListener, config.options)
          );
        }
      });
      this.addEventListener(EventsName.AttachShadow, () => {
        const shadowEventListeners: ListenersMap | undefined =
          Reflect.getMetadata(EventsName.ShadowEvent, this);
        Object.entries(shadowEventListeners || {}).forEach(
          ([eventName, config]) => {
            const eventListener = (...args: any) =>
              this[config.callbackName](...args);
            this.shadowRoot?.addEventListener(
              eventName,
              eventListener,
              config.options
            );
            if (
              typeof config.options === "object" &&
              config.options.removeOnDisConnect
            ) {
              this.addEventListener("disconnected", () =>
                this.shadowRoot?.removeEventListener(
                  eventName,
                  eventListener,
                  config.options
                )
              );
            }
          }
        );
      });
    }
  };
}

type ListenerDecorator<N extends keyof CustomEventMap> = <
  O extends {
    [P in keyof O]: P extends K ? (e: CustomEventMap[N]) => void : O[P];
  },
  K extends keyof O
  >(
  target: O,
  propertyKey: K
) => void;

export function EventListen<N extends keyof CustomEventMap>(
  eventName: N,
  options?: boolean | ListenerOptions
): ListenerDecorator<N> {
  return (target, propertyKey) => {
    const listeners: ListenersMap = Reflect.getOwnMetadata(
      EventsName.Event,
      target
    );
    if (!listeners) {
      Reflect.defineMetadata(
        EventsName.Event,
        { [eventName]: { callbackName: propertyKey, options } },
        target
      );
    } else {
      listeners[eventName] = { callbackName: propertyKey, options };
    }
  };
}

type AttrChangeListenerDecorator = <
  O extends {
    [P in keyof O]: P extends K ? (e: AttrChangeEvent) => void : O[P];
  },
  K extends keyof O
  >(
  target: O,
  propertyKey: K
) => void;

export function AttrChangeListen(
  attrName: string,
  options?: boolean | ListenerOptions
): AttrChangeListenerDecorator {
  return (target, propertyKey) => {
    const listeners: ListenersMap = Reflect.getOwnMetadata(
      EventsName.Event,
      target
    );
    if (!listeners) {
      Reflect.defineMetadata(
        EventsName.Event,
        { [attrName]: { callbackName: propertyKey, options } },
        target
      );
    } else {
      listeners[attrName] = { callbackName: propertyKey, options };
    }
  };
}

export function ShadowEventListen<N extends keyof CustomEventMap>(
  eventName: N,
  options?: boolean | ListenerOptions
): ListenerDecorator<N> {
  return (target, propertyKey) => {
    const listeners: ListenersMap = Reflect.getOwnMetadata(
      EventsName.ShadowEvent,
      target
    );
    if (!listeners) {
      Reflect.defineMetadata(
        EventsName.ShadowEvent,
        { [eventName]: { callbackName: propertyKey, options } },
        target
      );
    } else {
      listeners[eventName] = { callbackName: propertyKey, options };
    }
  };
}
