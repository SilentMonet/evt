import CreateElement from "@src/base/CreateElement";
import ComponentElement from "@base/ComponentElement";
import { EventListener } from "@base/EventListener";
import style from "./ObjectPropertyItem.less";

type ValueType =
  | string
  | number
  | undefined
  | null
  | ValueType[]
  | { [propertyName: string]: ValueType };
export interface ObjectPropertyItemDataType {
  name: string | number;
  value: ValueType;
}

interface CustomProperty {
  data?: ObjectPropertyItemDataType;
}
@EventListener
export class ObjectPropertyItem
  extends ComponentElement<CustomProperty>
  implements CustomProperty
{
  static tag = "object-property-item";
  shadowStyle = style;
  data?: ObjectPropertyItemDataType;
  getValueType(value: ValueType = this.data?.value) {
    return value === null
      ? "null"
      : value instanceof Array
      ? "array"
      : typeof value;
  }

  getChildren(value: ValueType = this.data?.value) {
    const childrenData: ObjectPropertyItemDataType[] = [];
    if (value instanceof Array) {
      value.forEach((item, index) =>
        childrenData.push({ name: index, value: item })
      );
    } else if (value instanceof Object) {
      Object.entries(value).map(([name, item]) =>
        childrenData.push({ name, value: item })
      );
    }
    return childrenData.map((data) => (
      <ObjectPropertyItem data={data}></ObjectPropertyItem>
    ));
  }
  render() {
    if (!this.data) {
      this.remove();
      return;
    }
    const { name, value } = this.data;
    const valueType = this.getValueType();
    const children = this.getChildren();
    const isEmpty = children.length === 0;
    this.shadowRoot?.append(
      <>
        <div id="self" className={`${valueType} ${isEmpty ? "empty" : ""}`}>
          <button
            id="triangle"
            onclick={() => this.toggleAttribute("expanded")}
          ></button>
          <span className="label">{name}</span>
          <span className="colon">:</span>
          <span
            className="value"
            ondblclick={function (this: any) {
              this.replaceChildren(<input value={String(value)} />);
            }}
          >
            {["object", "array"].includes(valueType) ? "" : String(value)}
          </span>
        </div>
        {isEmpty ? "" : <div id="children">{children}</div>}
      </>
    );
  }
}
customElements.define("object-property-item", ObjectPropertyItem);
export default ObjectPropertyItem;
