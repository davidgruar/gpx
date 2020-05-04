import React, { useState, FormEvent } from 'react';
import { Track, Point } from "../model";
import moment from 'moment';
import { TrackMap } from './TrackMap';

const parser = new DOMParser();

const parsePoint = (elem: Element, index: number): Point => {
    const elevation = elem.getElementsByTagName("ele")[0]?.innerHTML;
    const time = elem.getElementsByTagName("time")[0]?.innerHTML || "";
    return {
        lat: Number(elem.getAttribute("lat")),
        lon: Number(elem.getAttribute("lon")),
        elevation: Number(elevation),
        time: moment(time),
        element: elem,
        index,
    }
}

const parseGpx = (gpx: string): Track | null => {
    try {
        const xml = parser.parseFromString(gpx, "application/xml");
        const trk = xml.getElementsByTagName("trk")[0];
        const name = trk.getElementsByTagName("name")[0].innerHTML || "";
        const trkpts = trk.getElementsByTagName("trkpt");
        return {
            name,
            points: Array.from(trkpts).map(parsePoint)
        };
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export const GpxEditor: React.FC = () => {
    const [gpx, setGpx] = useState("");
    const [track, setTrack] = useState<Track | null>(null);
    const parse = (e: FormEvent) => {
        e.preventDefault();
        const track = parseGpx(gpx);
        setTrack(track);
    }

    return (
        <div>
            <form onSubmit={parse}>
                <textarea placeholder="Paste GPX" value={gpx} onChange={e => setGpx(e.target.value)} />
                <button>Parse</button>
            </form>
            {track && <TrackMap track={track}/>}
        </div>
    )
}