import CreateElement from "@src/base/CreateElement";
import ComponentElement from "@base/ComponentElement";
import { EventListener } from "@base/EventListener";
import "./ObjectPropertyItem";
import style from "./index.less";
import ObjectPropertyItem from "./ObjectPropertyItem";

const template = (
  <template>
    <div id="request-url" className="request-info">
      <span className="label">Request URL:</span>
      <span className="content"></span>
    </div>
    <div id="request-method" className="request-info">
      <span className="label"> Request Method: </span>
      <span className="content"></span>
    </div>
    <div id="status-code" className="request-info">
      <span className="label">Status Code:</span>
      <span className="content"></span>
    </div>
    <div id="cookie" className="request-info">
      <span className="label">Cookie:</span>
      <span className="content"></span>
    </div>

    <div id="response-data" className="request-info">
      <span className="label">Response Data:</span>
      <div className="content"></div>
    </div>
  </template>
);

interface CustomProperty {
  requestEvent?: chrome.devtools.network.Request;
}
@EventListener
class NetworkLogDetail
  extends ComponentElement<CustomProperty>
  implements CustomProperty
{
  static tag = "network-log-detail";
  shadowStyle = style;
  requestEvent?: chrome.devtools.network.Request;
  render() {
    if (!this.requestEvent) {
      this.remove();
      return;
    }
    this.shadowRoot?.appendChild((template as any).content.cloneNode(true));
    this.$("#request-url .content")!.textContent =
      this.requestEvent.request.url;
    this.$("#request-method .content")!.textContent =
      this.requestEvent.request.method;
    this.$("#status-code .content")!.textContent =
      this.requestEvent.response.status + "";
    this.$("#cookie .content")!.textContent =
      "SPC_EC = " +
      (this.requestEvent.request.cookies.find(
        (cookie) => cookie.name === "SPC_EC"
      )?.value || "");
    this.requestEvent.getContent((content: any) => {
      try {
        content = JSON.parse(content);
      } catch {}
      if (typeof content !== "object") {
        this.$("#response-data .content")?.append(String(content));
        return;
      }
      if (content instanceof Array) {
        content.forEach((value, index) =>
          this.$("#response-data .content")?.append(
            <ObjectPropertyItem
              data={{ name: index, value }}
            ></ObjectPropertyItem>
          )
        );
      } else {
        Object.entries(content).forEach(([key, value]) =>
          this.$("#response-data .content")?.append(
            <ObjectPropertyItem
              data={{ name: key, value: value as any }}
            ></ObjectPropertyItem>
          )
        );
      }
    });
  }
}

customElements.define("network-log-detail", NetworkLogDetail);

export default NetworkLogDetail;
