/// <reference lib="DOM" />

type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B;

type GetWritableKeys<T> = {
  [P in keyof T]: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P,
    never
  >;
}[keyof T];

type ExcludeReadonly<T> = Pick<T, GetWritableKeys<T>>;

declare namespace JSX {
  type Element = HTMLElement;

  type Tag = keyof JSX.IntrinsicElements;
  type IntrinsicElementMap = {
    [K in keyof HTMLElementTagNameMap]: {
      [P in keyof ExcludeReadonly<
        HTMLElementTagNameMap[K]
      >]?: HTMLElementTagNameMap[K][P];
    } & { [CustomAttribute: string]: string | number | boolean | any };
  };
  interface IntrinsicElements extends IntrinsicElementMap {}
}

declare interface DocumentOrShadowRoot {
  adoptedStyleSheets: CSSStyleSheet[];
}

interface CustomEventMap extends GlobalEventHandlersEventMap {}

interface AttrChangesEventMap { }

interface ShadowRoot {
  addEventListener<K extends keyof CustomEventMap>(
    type: K,
    listener: (this: ShadowRoot, ev: CustomEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener<K extends keyof CustomEventMap>(
    type: K,
    listener: (this: ShadowRoot, ev: CustomEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

interface AttrChangeEventDetail {
  name: string;
  oldValue: string;
  newValue: string;
}

type AttrChangeEvent = CustomEvent<AttrChangeEventDetail>;
