# CW Todo List ng2!

This simple Angular 2 Todo list app is using the brand new router.

It demonstrates how to build components, configure routes, inject services, and use the `@Input` decorator to bind properties to components.

We're using it as the client app to consume our synchronisation service...

## Dependencies
- You must have `node v >= 4.0` and `npm` installed (via `brew install node` or [NodeJS.org](https://nodejs.org/en/));
- `npm i -g typings webpack-dev-server webpack rimraf http-server`

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
serve-build
```

Both will open your browser on the necessary localhost port.

## Testing
The test setup includes `webpack_config/webpack.test.js`, `webpack_config/karma-test-shim.js`, and `karma.conf.js`.

```bash
 npm test
 ```

Note that `serve-build` will run tests prior to build