/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-spy-devtools
 */

import {
    CONTENT_BACKGROUND_CONNECT,
    CONTENT_MESSAGE,
    EXTENSION_KEY,
    MESSAGE_CONNECT,
    MESSAGE_DISCONNECT,
    PANEL_MESSAGE
} from "@devtools/constants";

import { Connection, Extension, Message, Post } from "@devtools/interfaces";

const backgroundConnection = chrome.runtime.connect({ name: CONTENT_BACKGROUND_CONNECT });

window.addEventListener("message", event => {
    if ((event.source === window) && event.data && (event.data.source === "rx-spy-devtools-plugin")) {
        backgroundConnection.postMessage(event.data);
    }
});

backgroundConnection.onMessage.addListener(message => {
    const { postType } = message as Post;
    if (postType === PANEL_MESSAGE) {
        window.postMessage({ ...message, source: "rx-spy-devtools-panel" }, "*");
    }
});

function installExtension(window: Window) {

    // Only type declaration imports can be used in here, as toString is
    // called on the function so that it can be injected into the page's
    // context - which is separate from the content script's context.

    class ConnectionImpl implements Connection {
        private static _posts = 0;
        private _connected = true;
        private _listener: ((event: MessageEvent) => void) | null = null;
        private _subscribers: ((message: Post) => void)[] = [];
        constructor({ version }: { version: string }) {
            this.post({ messageType: "connect", version });
            this._listener = event => {
                if ((event.source === window) && event.data && (event.data.source === "rx-spy-devtools-panel")) {
                    this._subscribers.forEach(next => next(event.data));
                }
            };
            window.addEventListener("message", this._listener);
        }
        disconnect(): void {
            if (this._listener) {
                window.removeEventListener("message", this._listener);
                this._listener = null;
            }
            this.post({ messageType: "disconnect" });
            this._connected = false;
        }
        post(message: Message): Post {
            if (!this._connected) {
                return { messageType: "", postId: "", postType: "content-message" };
            }
            const post = { ...message, postId: (++ConnectionImpl._posts).toString(), postType: "content-message" };
            window.postMessage({ ...post, source: "rx-spy-devtools-plugin" }, "*");
            return post;
        }
        subscribe(next: (message: Post) => void): { unsubscribe(): void } {
            const { _subscribers } = this;
            _subscribers.push(next);
            return {
                unsubscribe(): void {
                    const index = _subscribers.indexOf(next);
                    if (index !== -1) {
                        _subscribers.splice(index, 1);
                    }
                }
            };
        }
    }

    class ExtensionImpl implements Extension {
        connect(options: { version: string }): Connection {
            return new ConnectionImpl(options);
        }
    }

    Object.defineProperty(window, "__RX_SPY_EXTENSION__", {
        value: new ExtensionImpl()
    });
}

const script = document.createElement("script");
script.textContent = `;(${installExtension.toString()}(window))`;
document.documentElement.appendChild(script);
document.documentElement.removeChild(script);
