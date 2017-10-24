/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-spy-devtools
 */

import { fromEventPattern } from "rxjs/observable/fromEventPattern";
import { filter } from "rxjs/operators/filter";
import { finalize } from "rxjs/operators/finalize";
import { map } from "rxjs/operators/map";
import { mergeMap } from "rxjs/operators/mergeMap";
import { share } from "rxjs/operators/share";
import { takeUntil } from "rxjs/operators/takeUntil";
import { tap } from "rxjs/operators/tap";
import { CONTENT_CONNECT, CONTENT_MESSAGE, PANEL_CONNECT, PANEL_INIT, PANEL_MESSAGE } from "./constants";

type Message = any;
type MessageListener = (message: Message) => void;
type Port = chrome.runtime.Port;
type PortListener = (port: chrome.runtime.Port) => void;
type TabId = any;

const connections: { [key: string]: {
    contentPort: Port | null,
    devPort: Port | null
} } = {};

const ports = fromEventPattern<Port>(
    (handler: PortListener) => chrome.runtime.onConnect.addListener(handler),
    (handler: PortListener) => chrome.runtime.onConnect.removeListener(handler)
).pipe(share());

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

ports.pipe(
    filter(port => port.name === PANEL_CONNECT),
    mergeMap(port => messages(port, () => {
            const key = Object.keys(connections).find(key => connections[key].devPort === port);
            if (key) {
                connections[key].devPort = null;
            }
        }),
        (port, message) => ({ key: message.tabId, port, message })
    ),
    filter(({ key }) => Boolean(key))
).subscribe(({ key, port, message }) => {
    const connection = connections[key];
    if (message.name === PANEL_INIT) {
        if (connection) {
            connection.devPort = port;
        } else {
            connections[key] = { contentPort: null, devPort: port };
        }
    } else if (message.name === PANEL_MESSAGE) {
        if (connection && connection.contentPort) {
            connection.contentPort.postMessage(message);
        }
    }
});

ports.pipe(
    filter(port => port.name === CONTENT_CONNECT),
    map(port => ({
        key: ((port && port.sender && port.sender.tab) ? port.sender.tab.id : undefined)! as TabId,
        port
    })),
    filter(({ key }) => Boolean(key)),
    tap(({ key, port }) => {
        const connection = connections[key];
        if (connection) {
            connection.contentPort = port;
        } else {
            connections[key] = { contentPort: port, devPort: null };
        }
    }),
    mergeMap(({ key, port }) => messages(port, () => {
            connections[key].contentPort = null;
        }),
        ({ key, port }, message) => ({ key, port, message })
    )
).subscribe(({ key, port, message }) => {
    const connection = connections[key];
    if (message.name === CONTENT_MESSAGE) {
        if (connection && connection.devPort) {
            connection.devPort.postMessage(message);
        }
    }
});
