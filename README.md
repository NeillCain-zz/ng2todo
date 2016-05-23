# CW Todo List ng2!

This simple Angular 2 Todo list app is using the brand new router. 

It demonstrates how to build components, configure routes, inject services, and use the `@Input` decorator to bind properties to components.

We're using it as the client app to consume our sycnhrinsation service...

Todo:

- add sockety goodness to invoke cache update using the If-None-Match http headers 

## Dependencies
- You must have `node v >= 4.0` and `npm` installed (via `brew install node` or [NodeJS.org](https://nodejs.org/en/));
- `npm i -g typings webpack-dev-server webpack rimraf http-server`

-phantomjs installed locally:
    1. Install [phantomJS](http://phantomjs.org/download.html)
    2. Extract to `C:\phantomjs`
    3. Add the following to OS path env variable- `C:\phantomjs\bin;`
    4. `which phantomjs` check it's installed and at right location

## Install stuff
```bash
npm i
typings install 
```
## Run and serve dev
_will run webpack-dev-server and reload on change [runs --hot ;)]_
```bash
npm start
``` 
**waiting for webpack dev server [in beta currently] to firm up for more options like [opening browser window](https://github.com/webpack/webpack-dev-server/issues/311)**     

## Run and serve prod build
```bash
`serve-build`
```

Both will open your browser on the necessary localhost port.

## Testing
The test setup includes `webpack.test.config.js`, `spec-bundle.js`, and `karma.conf.js`. To run unit tests, execute `npm test` in your terminal.

Note that `serve-build` will run tests prior to build