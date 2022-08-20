import "../navigation";
import { ComponentElement } from "../ComponentElement";
import { CreateElement } from "../CreateElement";
import { EventListener, EventListen, } from "../EventListener";

export interface PageConfig {
    name: string;
    component: { tagName: string };
}

declare global {
    interface CustomEventMap {
        pop: CustomEvent<NavigationHistoryEntry>;
    }
}

interface Properties {
    pages: Record<string, PageConfig | PageConfig['component'] | string>;
}


@EventListener
export class PageViewStack extends ComponentElement<Properties> {
    private registeredPages: Record<string, PageConfig> = {};
    @EventListen("connected")
    onConnected() {
        const { pages } = this.properties;
        this.registeredPages = Object.keys(pages).reduce<Record<string, PageConfig>>((pageMap, pagePath) => {
            const pageConfig = pages[pagePath];
            if (typeof pageConfig === 'string') {
                pageMap[pagePath] = {
                    name: pageConfig,
                    component: { tagName: pageConfig }
                }
            } else if ("tagName" in pageConfig) {
                pageMap[pagePath] = {
                    name: pageConfig.tagName,
                    component: pageConfig
                }
            } else {
                pageMap[pagePath] = pageConfig;
            }
            return pageMap;
        }, {});

        this.attachNavigationListener();
    }

    async pushPage(pageConfig: PageConfig) {
        const page = document.createElement(pageConfig.component.tagName);
        this.shadowRoot?.append(page);
        await new Promise(resole=>setTimeout(resole,50));

        window.navigation.transition?.finished.then(() => {
            const currentEntry = window.navigation.currentEntry;
            if (!currentEntry) {
                return;
            }
            const onpop = (event: Event) => {
                if (page.dispatchEvent(new CustomElementEvent("pop", { detail: currentEntry }))) {
                    currentEntry.removeEventListener("pop", onpop);
                } else {
                    event.preventDefault();
                }
            };
            currentEntry.addEventListener("pop", onpop);
        });
    }
    async handleNavEvent(event: NavigateEvent): Promise<((e: Event) => void) | undefined> {
        const { navigationType, destination } = event;
        const destinationUrl = new URL(destination.url);
        const pageConfig = this.registeredPages[destinationUrl.pathname];

        const currentEntry = window.navigation.currentEntry;
        console.log(event);

        switch (navigationType) {
            case "replace":
            case "reload":
                if (currentEntry && !currentEntry.dispatchEvent(new CustomElementEvent("pop", { detail: currentEntry }))) {
                    return Promise.reject();
                }
            case "push":
                await this.pushPage(pageConfig);
                break;
            case "traverse":
                if (!currentEntry) {
                    break;
                }
                if (destination.index > currentEntry.index) {
                    await this.pushPage(pageConfig);
                    break;
                }
                for (const entry of window.navigation.entries().slice(destination.index + 1)) {
                    if (!entry.dispatchEvent(new CustomElementEvent("pop", { detail: currentEntry }))) {
                        break;
                    }
                }
                break;
        }
        return;
    }

    attachNavigationListener() {
        window.navigation.addEventListener("navigate", event => {
            (event as any).transitionWhile((this.handleNavEvent(event)));
        });

    }
}
