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
      const geojsonFile = fs.readFileSync(source.file);
      const sourceOptions = {
        maxZoom: configuration.maxzoom,
        buffer: 64
      }
      this.data[source.id] = geojsonVt(JSON.parse(geojsonFile), sourceOptions);
    });
    callback(null, this);
  }

  getTile(z, x, y, callback) {
    const jsonTile = this.configuration.sources.reduce((acc, source) => {
      let tile = this.data[source.id].getTile(z, x, y);

      if (tile === null) {
        tile = { features: [] }
      }

      return {...acc, [source.id]: tile }
    }, {})

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
    const { name, maxzoom, sources } = this.configuration;
    callback(null, {
      name,
      format: "pbf",
      maxzoom,
      vector_layers: sources.map(source => ({
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
