import CreateElement from "@src/base/CreateElement";
import ComponentElement from "@base/ComponentElement";
import {
  EventListener,
  EventListen,
  ShadowEventListen,
} from "@base/EventListener";
import "@base/GlobalPatch";
import documentStyle from "@common/style.less";
import style from "./index.less";
import ToolBar from "./ToolBar";
import NetworkLogItem from "./NetworkLogItem";
import NetworkLogDetail from "./NetworkLogDetail";

declare global {
  interface CustomEventMap {
    "switch-network-log": CustomEvent<chrome.devtools.network.Request>;
  }
}

@EventListener
class MainApp extends ComponentElement<{}> {
  static tag = "main-app";
  shadowStyle = style;
  render() {
    this.shadowRoot?.append(
      <>
        <ToolBar></ToolBar>
        <div id="log-container">
          <div id="network-log-list"></div>
        </div>
      </>
    );
  }
  onRequestFinished = (event: chrome.devtools.network.Request) => {
    if (event.response.content.mimeType.includes("json")) {
      this.$("#network-log-list")?.appendChild(
        <NetworkLogItem logItem={event} />
      );
    }
  };
  @EventListen("connected")
  onConnected() {
    chrome.devtools.network.onRequestFinished.addListener(
      this.onRequestFinished
    );
  }
  @ShadowEventListen("switch-network-log")
  onSwitchNetworkLog(e: CustomEventMap["switch-network-log"]) {
    this.$("network-log-detail")?.remove();
    this.$("#log-container")?.append(
      <NetworkLogDetail requestEvent={e.detail}></NetworkLogDetail>
    );
  }
  @EventListen("disconnected")
  onDisconnected() {
    chrome.devtools.network.onRequestFinished.removeListener(
      this.onRequestFinished
    );
  }
}
customElements.define("main-app", MainApp);

document.adoptedStyleSheets = [documentStyle];
document.body.appendChild(<MainApp />);
