globalThis.CustomElementEvent = class<T extends keyof CustomEventMap> extends (
  CustomEvent
)<GetCustomElementDetailType<T>> {
  constructor(type: T, init?: CustomEventInit<GetCustomElementDetailType<T>>) {
    super(type, init);
  }
};
globalThis.CustomBubbleEvent = class<T extends keyof CustomEventMap> extends (
  CustomEvent
)<GetCustomElementDetailType<T>> {
  constructor(type: T, detail?: GetCustomElementDetailType<T>) {
    super(String(type), { bubbles: true, detail });
  }
};
