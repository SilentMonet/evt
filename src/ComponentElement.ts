import { EventsName } from "./EventListener";

declare global {
  interface CustomEventMap {
    connected: Event;
    disconnected: Event;
    attachShadow: Event;
  }
}

export class ComponentElement<T = {}> extends HTMLElement {
  static tagName: string = "";
  shadowStyle?: CSSStyleSheet | CSSStyleSheet[];
  constructor(public properties: T) {
    super();
    this.addEventListener("connected", this.init);
  }
  init() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    if (this.shadowStyle) {
      shadowRoot.adoptedStyleSheets = Array.isArray(this.shadowStyle)
        ? this.shadowStyle
        : [this.shadowStyle];
    }
    this.dispatchEvent(new CustomElementEvent("attachShadow"));
  }
  $<T extends HTMLElement = HTMLElement>(selectors: string): T | null {
    if (this.shadowRoot) {
      return this.shadowRoot.querySelector(selectors);
    }
    return null;
  }
  private connectedCallback() {
    this.dispatchEvent(new CustomElementEvent("connected"));
  }
  private disconnectedCallback() {
    this.dispatchEvent(new CustomElementEvent("disconnected"));
  }
  private attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    this.dispatchEvent(
      new CustomEvent<AttrChangeEventDetail>(
        EventsName.AttrChanged + ":" + name,
        {
          detail: { name, oldValue, newValue },
        }
      )
    );
  }
}
