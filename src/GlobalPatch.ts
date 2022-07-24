type GetCustomElementDetailType<T extends keyof CustomEventMap> =
  "detail" extends keyof CustomEventMap[T]
  ? CustomEventMap[T]["detail"]
  : never;
declare global {
  var CustomElementEvent: {
    prototype: CustomEvent;
    new <T extends keyof CustomEventMap>(
      type: T,
      eventInitDict?: CustomEventInit<GetCustomElementDetailType<T>>
    ): CustomEvent;
  };

  var CustomBubbleEvent: {
    new <T extends keyof CustomEventMap>(
      type: T,
      detail?: GetCustomElementDetailType<T>
    ): CustomEvent;
  };
}

globalThis.CustomElementEvent = class <T extends keyof CustomEventMap> extends (
  CustomEvent
)<GetCustomElementDetailType<T>> {
  constructor(type: T, init?: CustomEventInit<GetCustomElementDetailType<T>>) {
    super(type, init);
  }
};
globalThis.CustomBubbleEvent = class <T extends keyof CustomEventMap> extends (
  CustomEvent
)<GetCustomElementDetailType<T>> {
  constructor(type: T, detail?: GetCustomElementDetailType<T>) {
    super(String(type), { bubbles: true, detail });
  }
};

export default {}