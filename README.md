# tilelive-geojson
A [tilelive](https://github.com/mapbox/tilelive) vector tile source for [hsl-map-server](https://github.com/HSLdevcom/hsl-map-server) for creating vector tiles from GeoJSON sources (one or multiple for a layer).

## Usage
Give the following configuration for the layer:

```jsonc
{
  "protocol": "geojson:", // Defines layer to use this module
  "query": {}, // required for tilelive
  "name": "Ticket sales", // Friendly name of the layer
  "maxzoom": 20, // Max zoom level (optional, default 14)
  "sources": [{ // Can be multiple layers / sources
    "id": "ticket-sales", // Layer id to be used in vector tile
    "description": "", // Optional description
    "file": "ticket-sales.geojson" // Data file to be served as a vector tile layer
  }]
}
```
