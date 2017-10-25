/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-spy-devtools
 */

import { CONTENT_CONNECT, CONTENT_MESSAGE, PANEL_MESSAGE } from "./constants";

const backgroundConnection = chrome.runtime.connect({ name: CONTENT_CONNECT });

window.addEventListener("message", event => {
    const { data, source } = event;
    if ((source === window) && (typeof data === "object") && data && (data.source === "rxjs-spy")) {
        backgroundConnection.postMessage({ ...data, name: CONTENT_MESSAGE });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { name } = message;
    if (name === PANEL_MESSAGE) {
        window.postMessage({ ...message, source: "rxjs-spy-devtools" }, "*");
    }
});
