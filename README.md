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
  "bounds": [18, 58, 32, 71], // Extent of data coordinates, (optional, defaults to entire world)
  "center": [24.9, 60.1, 14], // Default location for client. The last value is zoom level. (Optional, defaults to [-122.444, 37.7908, 12])
  "sources": [{ // Can be multiple layers / sources
    "id": "ticket-sales", // Layer id to be used in vector tile
    "description": "", // Optional description
    "file": "ticket-sales.geojson" // Data file to be served as a vector tile layer
  }]
}
```
