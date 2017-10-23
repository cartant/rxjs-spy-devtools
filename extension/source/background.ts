/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-spy-devtools
 */

import { fromEventPattern } from "rxjs/observable/fromEventPattern";
import { filter } from "rxjs/operators/filter";
import { finalize } from "rxjs/operators/finalize";
import { mergeMap } from "rxjs/operators/mergeMap";
import { share } from "rxjs/operators/share";
import { takeUntil } from "rxjs/operators/takeUntil";
import { tap } from "rxjs/operators/tap";
import { CONTENT_CONNECT, CONTENT_MESSAGE, PANEL_CONNECT, PANEL_INIT } from "./constants";

const connections: { [key: string]: {
    contentPort?: any,
    devPort?: any
} } = {};

const ports = fromEventPattern<any>(
    (handler: any) => chrome.runtime.onConnect.addListener(handler),
    (handler: any) => chrome.runtime.onConnect.removeListener(handler)
).pipe(share());

const messages = (port: any, teardown: () => void) => fromEventPattern<any>(
    (handler: any) => port.onMessage.addListener(handler),
    (handler: any) => port.onMessage.removeListener(handler)
).pipe(
    takeUntil(fromEventPattern(
        (handler: any) => port.onDisconnect.addListener(handler),
        (handler: any) => port.onDisconnect.removeListener(handler)
    )),
    finalize(teardown)
);

ports.pipe(
    filter(port => port.name === PANEL_CONNECT),
    mergeMap(port => messages(port, () => {
            const key = Object.keys(connections).find(key => connections[key].devPort === port);
            if (key) {
                connections[key].devPort = null;
            }
        }),
        (port, message) => ({ port, message })
    )
).subscribe(({ port, message }) => {
    if (message.name === PANEL_INIT) {
        const tabId = message.tabId;
        if (connections[tabId]) {
            connections[tabId].devPort = port;
        } else {
            connections[tabId] = { devPort: port };
        }
    }
});

ports.pipe(
    filter(port => port.name === CONTENT_CONNECT),
    tap(port => {
        const tabId = port.sender.tab.id;
        if (connections[tabId]) {
            connections[tabId].contentPort = port;
        } else {
            connections[tabId] = { contentPort: port };
        }
    }),
    mergeMap(port => messages(port, () => {
            const tabId = port.sender.tab.id;
            connections[tabId].contentPort = null;
        }),
        (port, message) => ({ port, message })
    )
).subscribe(({ port, message }) => {
    if (message.name === CONTENT_MESSAGE) {
        const tabId = port.sender.tab.id;
        if (connections[tabId] && connections[tabId].devPort) {
            connections[tabId].devPort.postMessage(message);
        }
    }
});
