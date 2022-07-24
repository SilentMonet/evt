import { ComponentElement } from "./ComponentElement";

interface ExtendableTarget {
    new(...args: any[]): ComponentElement<any>;
    tagName?: string;
    readonly prototype: Object;
}

export function register(tagName: string) {
    return function <T extends ExtendableTarget>(target: T) {
        target.tagName = tagName;
        customElements.define(tagName, target);
        return target;
    }
}
