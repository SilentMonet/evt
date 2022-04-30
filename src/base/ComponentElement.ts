import { EventsName } from "./EventListener";

declare global {
  interface CustomEventMap {
    connected: Event;
    disconnected: Event;
    [EventsName.AttachShadow]: Event;
  }
}

export type CustomProperty<Properties extends {}> =
  OptionalToUndefined<Properties>;
export default class ComponentElement<T extends {}> extends HTMLElement {
  static tag: string = "";
  shadowStyle?: CSSStyleSheet;
  constructor(props: T) {
    super();
    this.addEventListener("connected", this.init);
  }
  render() {}
  init() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.dispatchEvent(new CustomElementEvent(EventsName.AttachShadow));
    if (this.shadowStyle) {
      shadowRoot.adoptedStyleSheets = [this.shadowStyle];
    }
    this.render();
  }
  $(
    selectors: Parameters<ParentNode["querySelector"]>[0]
  ): ReturnType<ParentNode["querySelector"]> {
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
