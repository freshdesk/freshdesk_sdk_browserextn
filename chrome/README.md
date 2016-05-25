# Google Chrome Extension for Apps

To enable local testing of apps.

## Run

Open Google Chrome. Visit [chrome://extensions](chrome://extensions). Select *Developer mode* checkbox. Click on the button *Load unpacked extension...* button, and browse to the `src/` directory. This extension will be loaded. Visit the app page to test your app.

## Using Grunt to package the Chrome Extension

### Install `node.js` and `npm`

Install [node.js](https://nodejs.org/en/).

### Install `grunt` in your machine

    $ sudo npm install -g grunt-cli

### Do `npm install`

To install all the dependencies of chrome extension. Must be performed inside the chrome extension dir:

    $ npm install

### Generating private key

In Chrome [extensions](chrome://extensions/) page, click on the button *Pack extension...* button. Pack atleast once using this technique, and you will get a file `src.pem`. Rename it to `key.pem` for use with Grunt.

### Grunt commands

#### Build `.crx` package

    $ grunt

Package will be build inside `build/` dir.

#### Clean

    $ grunt clean
