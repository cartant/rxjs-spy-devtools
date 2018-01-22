/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-spy-devtools
 */

"use strict";

const fs = require("fs");
const [,, version] = process.argv;

if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`${version} is not a valid Chrome manifest version: https://developer.chrome.com/extensions/manifest/version`);
}

const files = [
    "./assets/manifest.json",
    "./package.json",
    "../panel/package.json"
];
files.forEach(file => {
    const content = fs.readFileSync(file).toString();
    fs.writeFileSync(file, content.replace(/"version"\s*:\s*"\d+\.\d+\.\d+"/, `"version": "${version}"`));
});
