# symbiot-docs

Documentation for the [Symbiot](https://github.com/fpoulin/symbiot) project.

:fast_forward:  **[Live Site](https://fpoulin.github.com/symbiot-docs)**  :rewind:

## Quickstart

### Prerequisites

  - Make sure [Node.js](http://nodejs.org/) is installed and in your `PATH`
  - Install Grunt: `npm install -g grunt-cli`

### Build / Run site locally

  1. Clone project
  2. Open the folder: `cd symbiot-docs`
  3. Install dependencies: `npm install`
  4. Run the dev server: `grunt dev`
  5. Open a browser at [`http://localhost:7000/`](http://localhost:7000/)

### Build for Github pages (for the record)

First:
  1. Follow above steps `1`, `2` and `3`
  2. Build for prod: `grunt prod --minifyAssets=true --baseUrl=/json-shapeshifter-docs`

Then:
  1. Clone project in separate folder (ex: `json-shapeshifter-docs-pages`)
  2. Open the folder: `cd json-shapeshifter-docs-pages`
  2. Checkout Github pages branch: `git checkout gh-pages`
  3. Copy the content of the `build` folder from `json-shapeshifter-docs`
  4. Check status, stage, commit and push

## Credits & additional documentation

Check [Apidoc-Seed](https://github.com/lotaris/apidoc-seed).

## License

Under [MIT License](http://opensource.org/licenses/MIT).
