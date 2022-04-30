import CreateElement from "@src/base/CreateElement";
import ComponentElement, { CustomProperty } from "@base/ComponentElement";
import { EventListener, EventListen, AttrChangeListen } from "@base/EventListener";
import style from "./NetworkLogItem.less";

interface Properties {
  logItem?: chrome.devtools.network.Request;
}
@EventListener
class NetworkLogItem
  extends ComponentElement<Properties>
  implements CustomProperty<Properties>
{
  static tag = "network-log-item";
  shadowStyle = style;
  logItem: chrome.devtools.network.Request | undefined = undefined;
  render() {
    this.tabIndex = 0;
    const url = new URL(this.logItem?.request.url || "");
    this.shadowRoot?.append(<span id="url">{url.pathname}</span>);
  }
  @EventListen("click")
  onClick() {
    this.dispatchEvent(
      new CustomBubbleEvent("switch-network-log", this.logItem)
    );
  }
}

customElements.define("network-log-item", NetworkLogItem);

export default NetworkLogItem;
