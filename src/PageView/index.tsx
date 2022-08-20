import { ComponentElement } from "../ComponentElement";
import { CreateElement } from "../CreateElement";
import { EventListener, EventListen, } from "../EventListener";
import style from "./index.less";

@EventListener
export class PageView extends ComponentElement<{}> {
    constructor() {
        super({});
        this.attachShadow({ mode: 'open' });
        this.shadowRoot?.adoptedStyleSheets.push(style);
    }

    @EventListen("pop")
    onpop(event: Event) {
        console.log(event);
        this.animate([{ transform: 'translateX(0px)' },
        { transform: 'translateX(100%)' }
        ], {
            duration: 300,
            iterations: 1
        }).addEventListener("finish", () => this.remove());
    }
}
