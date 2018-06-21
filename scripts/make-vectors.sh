mkdir -p tmpdata
cd tmpdata

# countries
if [ ! -f countries.zip ]; then
  curl "http://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_0_countries.zip" -o countries.zip
fi
unzip -o countries.zip

mkdir -p ../src/assets/geojson/

ogr2ogr -f GeoJSON -t_srs crs:84 ../src/assets/geojson/vectors.json ne_10m_admin_0_countries.shp
