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
import { CONTENT_CONNECT, CONTENT_MESSAGE, PANEL_CONNECT, PANEL_INIT, PANEL_MESSAGE } from "./constants";

const connections: { [key: string]: {
    contentPort?: any,
    devPort?: any
} } = {};

type Port = chrome.runtime.Port;
type PortListener = (port: chrome.runtime.Port) => void;

const ports = fromEventPattern<Port>(
    (handler: PortListener) => chrome.runtime.onConnect.addListener(handler),
    (handler: PortListener) => chrome.runtime.onConnect.removeListener(handler)
).pipe(share());

type Message = any;
type MessageListener = (message: Message) => void;

const messages = (port: Port, teardown: () => void) => fromEventPattern<Message>(
    (handler: MessageListener) => port.onMessage.addListener(handler),
    (handler: MessageListener) => port.onMessage.removeListener(handler)
).pipe(
    takeUntil(fromEventPattern(
        (handler: PortListener) => port.onDisconnect.addListener(handler),
        (handler: PortListener) => port.onDisconnect.removeListener(handler)
    )),
    finalize(teardown)
);

const tabId = (port: Port) => (port && port.sender && port.sender.tab) ?
    port.sender.tab.id :
    undefined;

ports.pipe(
    filter(port => port.name === PANEL_CONNECT),
    mergeMap(port => messages(port, () => {
            const key = Object.keys(connections).find(key => connections[key].devPort === port);
            if (key) {
                connections[key].devPort = null;
            }
        }),
        (port, message) => ({ port, message })
    ),
    filter(({ message }) => Boolean(message.tabId))
).subscribe(({ port, message }) => {
    const key = message.tabId;
    if (message.name === PANEL_INIT) {
        if (connections[key]) {
            connections[key].devPort = port;
        } else {
            connections[key] = { devPort: port };
        }
    } else if (message.name === PANEL_MESSAGE) {
        if (connections[key] && connections[key].contentPort) {
            connections[key].contentPort.postMessage(message);
        }
    }
});

ports.pipe(
    filter(port => port.name === CONTENT_CONNECT),
    filter(port => Boolean(tabId(port))),
    tap(port => {
        const key = tabId(port)!;
        if (connections[key]) {
            connections[key].contentPort = port;
        } else {
            connections[key] = { contentPort: port };
        }
    }),
    mergeMap(port => messages(port, () => {
            const key = tabId(port)!;
            connections[key].contentPort = null;
        }),
        (port, message) => ({ port, message })
    )
).subscribe(({ port, message }) => {
    const key = tabId(port)!;
    if (message.name === CONTENT_MESSAGE) {
        if (connections[key] && connections[key].devPort) {
            connections[key].devPort.postMessage(message);
        }
    }
});
