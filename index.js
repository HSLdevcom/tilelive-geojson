"use strict"
const geojsonVt = require('geojson-vt');
const vtPbf = require('vt-pbf');
const zlib = require('zlib');
const fs = require('fs')

class GeoJSONSource {
  constructor(configuration, callback) {
    this.configuration = configuration
    this.data = {}

    configuration.sources.forEach(source => {
      const geojsonFile = fs.readFileSync(file);
      sourceOptions = {
        maxZoom: source.maxzoom,
        buffer: 64
      }
      this.data[source.id] = geojsonVt(JSON.parse(geojsonFile), sourceOptions);
    });
  }

  getTile(z, x, y, callback) {
    const jsonTile = this.configuration.sources.reduce((acc, source) => {
      let tile = this.data[source.id].getTile(z, x, y);

      if (tile === null) {
        tile = { features: [] }
      }

      return {...acc, [source.id]: tile }
    })

    const data = Buffer.from(vtPbf.fromGeojsonVt(jsonTile));

    zlib.gzip(data, function (err, buffer) {
      if (err) {
        callback(err);
        return;
      }

      callback(null, buffer, { "content-encoding": "gzip" })
    })
  }

  getInfo(callback) {
    callback(null, {
      format: "pbf",
      maxzoom: this.configuration.maxzoom,
      vector_layers: this.configuration.sources.map(source => ({
        id: source.id,
        desciption: source.description
      }))
    })
  }
}

module.exports = GeoJSONSource

module.exports.registerProtocols = (tilelive) => {
  tilelive.protocols['geojson:'] = GeoJSONSource
}
