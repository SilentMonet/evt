import CreateElement from "@src/base/CreateElement";
import ComponentElement from "../../base/ComponentElement";
import { EventListener } from "@base/EventListener";
import style from "./ToolBar.less";

@EventListener
class ToolBar extends ComponentElement<{}> {
  static tag = "tool-bar";
  shadowStyle = style;
  render() {
    this.shadowRoot?.append(
      <>
        <button
          id="refresh"
          className="icon"
          onclick={() => location.reload()}
        ></button>
        <button id="switch-light" className="icon on"></button>
        <button id="clear" className="icon"></button>
      </>
    );
  }
}
customElements.define("tool-bar", ToolBar);

export default ToolBar;
