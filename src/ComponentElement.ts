import { EventsName } from "./EventListener";
import "./GlobalPatch";

declare global {
  interface CustomEventMap {
    connected: Event;
    disconnected: Event;
    attachShadow: CustomEvent<ShadowRoot>;
  }
}

export class ComponentElement<T = {}> extends HTMLElement {
  static tagName: string = "";
  shadowStyle?: CSSStyleSheet | CSSStyleSheet[];
  constructor(public properties: T) {
    super();
  }
  attachShadow(init: ShadowRootInit): ShadowRoot {
    const shadowRoot = super.attachShadow(init);
    this.dispatchEvent(new CustomElementEvent("attachShadow", { detail: shadowRoot }));
    return shadowRoot;
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
