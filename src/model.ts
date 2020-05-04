import { Moment } from "moment";

export type Track = {
    name: string;
    points: Point[];
}

export type Point = {
    lat: number;
    lon: number;
    elevation: number;
    time: Moment;
    element: Element;
    index: number;
}