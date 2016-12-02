# Google Chrome Extension for Apps

To enable local testing of apps.

## Run

Open Google Chrome. Visit [chrome://extensions](chrome://extensions). Select *Developer mode* checkbox. Click on the button *Load unpacked extension...* button, and browse to the `src/` directory. This extension will be loaded. Visit the app page to test your app.

## Using gulp to package the Chrome Extension

### Install `node.js` and `npm`

Install [node.js](https://nodejs.org/en/).

### Install `gulp` in your machine

    $ sudo npm install -g gulp

### Do `npm install`

To install all the dependencies of chrome extension. Must be performed inside the chrome extension dir:

    $ npm install

### Generating private key

In Chrome [extensions](chrome://extensions/) page, click on the button *Pack extension...* button. Pack atleast once using this technique, and you will get a file `src.pem`. Rename it to `key.pem` for use with gulp.

### Gulp commands

#### Build `.crx` package

    $ gulp

Package will be build inside `build/` dir.

#### Clean

    $ gulp clean
