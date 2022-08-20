import "reflect-metadata";
import { ComponentElement } from "./ComponentElement";

export enum EventsName {
  Event = "Event",
  ShadowEvent = "ShadowEvent",
  AttachShadow = "attachShadow",
  AttrChanged = "attrChanged",
}

interface ExtendableTarget {
  new(...args: any[]): ComponentElement;
  readonly prototype: Object;
}
interface ListenerOptions extends AddEventListenerOptions {
  removeOnDisConnect?: boolean;
}
interface ListenersMap {
  [eventName: string]: {
    callbackName: string | number | symbol;
    options?: boolean | ListenerOptions;
  }[];
}

export function EventListener<T extends ExtendableTarget>(target: T) {
  return class EventListenerElement extends target {
    [callbackNames: string | symbol]: any;
    constructor(...args: any[]) {
      super(...args);
      const eventListeners: ListenersMap | undefined = Reflect.getOwnMetadata(
        EventsName.Event,
        target.prototype
      );
      Object.entries(eventListeners || {}).forEach(([eventName, listeners]) => {
        listeners.forEach(listener => {
          const callback = this[listener.callbackName];
          this.addEventListener(eventName, callback, listener.options);
          if (
            typeof listener.options === "object" &&
            listener.options.removeOnDisConnect
          ) {
            this.addEventListener("disconnected", () =>
              this.removeEventListener(eventName, callback, listener.options)
            );
          }
        })
      });
      const shadowEventListeners: ListenersMap | undefined =
        Reflect.getOwnMetadata(EventsName.ShadowEvent, target.prototype);
      if (Object.keys(shadowEventListeners || {}).length !== 0) {
        this.addEventListener(EventsName.AttachShadow, () => {
          Object.entries(shadowEventListeners || {}).forEach(
            ([eventName, listeners]) => {
              listeners.forEach(listener => {
                const callback = this[listener.callbackName];
                this.shadowRoot?.addEventListener(
                  eventName,
                  callback,
                  listener.options
                );
                if (
                  typeof listener.options === "object" &&
                  listener.options.removeOnDisConnect
                ) {
                  this.addEventListener("disconnected", () =>
                    this.shadowRoot?.removeEventListener(
                      eventName,
                      callback,
                      listener.options
                    )
                  );
                }
              })

            }
          );
        });

      }
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
        { [eventName]: [{ callbackName: propertyKey, options }] },
        target
      );
    } else if (!(eventName in listeners)) {
      listeners[eventName] = ([{ callbackName: propertyKey, options }]);
    } else {
      listeners[eventName].push({ callbackName: propertyKey, options });
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
    const eventName = EventsName.AttrChanged + ":" + attrName;
    if (!listeners) {
      Reflect.defineMetadata(
        EventsName.Event,
        { [eventName]: [{ callbackName: propertyKey, options }] },
        target
      );
    } else if (!(eventName in listeners)) {
      listeners[eventName] = ([{ callbackName: propertyKey, options }]);
    } else {
      listeners[eventName].push({ callbackName: propertyKey, options });
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
        { [eventName]: [{ callbackName: propertyKey, options }] },
        target
      );
    } else if (!(eventName in listeners)) {
      listeners[eventName] = ([{ callbackName: propertyKey, options }]);
    } else {
      listeners[eventName].push({ callbackName: propertyKey, options });
    }
  };
}
