/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-spy-devtools
 */

import { interval } from "rxjs/observable/interval";
import { map } from "rxjs/operators/map";
import { create } from "rxjs-spy";
import { tag } from "rxjs-spy/operators/tag";

const spy = create({
    sourceMaps: true
});

interval(1000).pipe(
    tag("interval"),
    map(value => value + 1),
    tag("mapped")
).subscribe(value => console.log(value));
