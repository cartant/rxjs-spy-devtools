import { Observable } from 'rxjs/Observable';

export function observe<T>(observableTest: () => Observable<T>): (callbackTest: (error?: Error) => void) => void {

    return (callbackTest: (error?: Error) => void) => observableTest().subscribe(undefined, callbackTest, callbackTest);
}
