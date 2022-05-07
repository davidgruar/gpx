import * as L from 'leaflet';
import React, { FC, useState, useRef } from 'react';
import { Map, TileLayer, Polyline, Viewport, LayersControl, Marker } from "react-leaflet";
import { Track, Point } from '../model';

type TrackMapProps = { track: Track }

function min(arr: number[]) {
    return arr.reduce((a, b) => a < b ? a : b);
}

function max(arr: number[]) {
    return arr.reduce((a, b) => a > b ? a : b);
}

export const TrackMap: FC<TrackMapProps> = ({ track }) => {
    const [points, setPoints] = useState(track.points);
    const lats = points.map(p => p.lat);
    const lons = points.map(p => p.lon);
    const minLat = min(lats);
    const minLon = min(lons);
    const maxLat = max(lats);
    const maxLon = max(lons);
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;
    const latlngs = points.map(p => ({ lat: p.lat, lng: p.lon }));

    const mapRef = useRef<Map>(null);
    const [viewport, setViewport] = useState<Viewport | null>(null);

    const bounds = mapRef.current?.leafletElement.getBounds();
    const markerPoints = viewport?.zoom! < 17 || !bounds
        ? []
        : points.filter(p => p.lon > bounds.getWest() && p.lon < bounds.getEast() && p.lat > bounds.getSouth() && p.lat < bounds.getNorth());

    const onMarkerDrag = (mp: Point, latlng: L.LatLng) => {
        const updatedPoint = {
            ...mp,
            lat: latlng.lat,
            lon: latlng.lng
        };
        const updatedPoints = points.map(p => p === mp ? updatedPoint : p);
        setPoints(updatedPoints);
    }
    return (
        <Map
            className="map"
            ref={mapRef}
            center={[centerLat, centerLon]}
            bounds={[[minLat, minLon], [maxLat, maxLon]]}
            onViewportChange={vp => setViewport(vp)}
            maxZoom={19}
        >
            <LayersControl>
                <LayersControl.BaseLayer name="OSM" checked={true}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite">
                    <TileLayer
                        attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <Polyline positions={latlngs} />
            {markerPoints.map(mp => <Marker
                key={mp.index}
                position={[mp.lat, mp.lon]}
                draggable={true}
                autoPan={false}
                opacity={0.8}
                ondrag={(e: any) => onMarkerDrag(mp, e.latlng)} />)}
        </Map>
    )
}