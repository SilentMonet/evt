import ComponentElement from "./ComponentElement";

export interface ComponentElementConstructor extends Function {
  tagName: string;
}

function appendChild(
  element: HTMLElement | HTMLTemplateElement | DocumentFragment,
  child: any
) {
  let childNode: string | HTMLElement = "";
  if ([undefined, null, false].includes(child)) {
    return;
  }
  if (child instanceof HTMLElement) {
    childNode = child;
  }
  if (child instanceof Array) {
    child.forEach((subChild) => appendChild(element, subChild));
    return;
  }

  if (element instanceof HTMLTemplateElement) {
    element.content.append(childNode || child);
  } else {
    element.append(childNode || child);
  }
}

type IntsEleType<T> = T extends JSX.Tag ? JSX.IntrinsicElementMap[T] : never;

function CreateElement(
  tag: Symbol,
  props: never,
  ...children: Node[]
): DocumentFragment;
function CreateElement(
  tag: JSX.Tag,
  props: JSX.IntrinsicElementMap[typeof tag] | null,
  ...children: Node[]
): JSX.IntrinsicElements[typeof tag];
function CreateElement(
  tag: ComponentElementConstructor,
  props: Object | null,
  ...children: Node[]
): HTMLElement;
function CreateElement(
  tag: Symbol | JSX.Tag | ComponentElementConstructor,
  props: IntsEleType<typeof tag> | Object | null,
  ...children: Node[]
) {
  switch (typeof tag) {
    case "symbol":
      if (tag !== CreateElement.Fragment) {
        throw "Unknown Fragment Symbol";
      }
      {
        const element = document.createDocumentFragment();
        appendChild(element, children);
        return element;
      }
    case "string": {
      const element = document.createElement(tag);
      for (const [name, value] of Object.entries(props ?? {})) {
        if (name in element) {
          (element as any)[name] = value;
        } else {
          if (typeof value === "boolean") {
            value && element.setAttribute(name, "");
          } else {
            element.setAttribute(name, String(value));
          }
        }
      }
      appendChild(element, children);
      return element as JSX.IntrinsicElements[typeof tag];
    }
    case "function":
      const element = document.createElement(tag.tagName) as ComponentElement;
      const properties: any = Object.assign({}, props);
      for (const [name, value] of Object.entries(properties)) {
        if (name in element) {
          try {
            (element as any)[name] = value;
            delete properties[name];
          } catch (e) {
            console.error(e);
          }
        }
      }
      element.properties = properties;
      appendChild(element, children);
      return element;
    default:
      throw "Unknown Tag";
  }
}

CreateElement.Fragment = Symbol("Fragment Element");

export default CreateElement;
