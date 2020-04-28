import React, { useState } from 'react';
import { Track, Point } from '../model';

type TrackMapProps = { track: Track }

function min(arr: number[]) {
    return arr.reduce((a, b) => a < b ? a : b);
}

function max(arr: number[]) {
    return arr.reduce((a, b) => a > b ? a : b);
}

export const TrackMap: React.FC<TrackMapProps> = ({ track }) => {
    const [selected, setSelected] = useState<Point | null>(null);
    const points = track.points;
    const lats = points.map(p => p.lat);
    const lons = points.map(p => p.lon);
    const minLat = min(lats);
	const minLon = min(lons);
	const maxLat = max(lats);
	const maxLon = max(lons);
	const latDiff = maxLat - minLat;
    const lonDiff = maxLon - minLon;
    const plotPoints = points.map(p => ({
        point: p,
        x: (p.lon - minLon) / lonDiff * 590 + 5,
        y: 600 - (p.lat - minLat) / latDiff * 590 + 5,
    }))

    return (
        <div>
            <div>{JSON.stringify(selected)}</div>
            <pre>{selected?.element.outerHTML}</pre>
            <svg viewBox="0 0 600 600" height="600" width="600" style={{border: "1px solid #aaa"}}>
            {plotPoints.map(p => <circle key={p.point.time.toString()} cx={p.x} cy={p.y} r={2} fill="red" onMouseOver={() => setSelected(p.point)} />)}
        </svg>
        </div>
    )
}