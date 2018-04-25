# rxjs-spy-devtools

This is a WIP Chrome DevTools extension for [`rxjs-spy`](https://github.com/cartant/rxjs-spy).

It's not yet ready to be released on the Chrome Web Store, but if you want to check it out, it's installable as an unpacked Chrome extension. Just follow these steps:

1. Clone the repo:

        git clone https://github.com/cartant/rxjs-spy-devtools.git
        cd rxjs-spy-devtools

2. Build the panel:

        cd panel
        yarn install
        yarn build:p

3. Build the extension:

        cd ../extension
        yarn install
        yarn build:p

4. Install the extension:

    * In Chrome, navigate to "chrome://extensions".
    * Click the "Load unpacked extension..." button.
    * Navigate to the `rxjs-spy-devtools/extension/dist` directory and click OK.

5. If you open the DevTools, you should have an "RxJS" entry in the tab panel. (You might have to click the `>>` button to see it.)

6. If you navigate to a page in which a spy has been created (using at least version 6.0.0 of `rxjs-spy`), you should see a list of observables (filterable on tag and type) in the "RxJS" panel. The simplest way to do this is to run the following command from within the `extension` directory:

        yarn harness

    You might find that you need to refresh the page after opening to the "RxJS" panel - as I said, it still needs some work.

    The panel's UI isn't indicative of what the released tools will look like - it's pretty basic and is just there to expose/test the logging and pausing functionality, etc.