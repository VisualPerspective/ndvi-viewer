<p align="center">
  <a href="http://iceland.visualperspective.io/"><img src="/iceland-vegetation.jpg?raw=true" width="200px"></a>
</a>

# NDVI Viewer

Allows the analysis of NDVI over time for a region using regl, WebGL, and React. ([Live Demo](http://iceland.visualperspective.io/))

*__Note:__ this is alpha software and requires more documentation and tests before being generally useful.*

### Running the project
To run the project, you'll need:
* Node 9+
* a recent version of Yarn
* git-lfs
* ogr2ogr

Then:
* Clone this repo, and run `yarn` to install dependencies
* Run `bash scripts/make-vectors.sh` to download and process geojson for Iceland
* Run `yarn start` to start a development server
* The app should be available at `http://localhost:8080` (initial page load will take a while for compilation)

### Data format
The main data file, `src/assets/atlas/ndvi.atlas`, was produced using [geotiff-atlas](https://github.com/VisualPerspective/geotiff-atlas). Refer to the README of that repository for more information.

### Focus on Iceland data set
For now, this viewer is focused on Iceland, to make it work with another region some changes and enhancements would need to be made:
* Change various constants in `constants.ts`
* Download a set of geotiffs for an area, and process them using https://github.com/VisualPerspective/geotiff-atlas
* Make other tweaks/changes to make the code more general
