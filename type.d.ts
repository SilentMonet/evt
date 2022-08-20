declare module "*.less" {
    const style: CSSStyleSheet;
    export default style;
}


interface DocumentOrShadowRoot {
    adoptedStyleSheets: CSSStyleSheet[];
}