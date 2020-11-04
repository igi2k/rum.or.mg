import m from "mithril";
import * as d3 from "d3-geo";
import * as topojson from "topojson-client";
import { CountryCodes } from "../country-codes";

import "./spirit-map.less";

const url = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const Colors = {
    InnerBorder: "#A0A0A0",
    Border: "#A0A0A0",
    Selected: "#FF0000"
};

export function SpiritMap() {
    let context;
    let width = 975 * 2;
    let height;
    
    let path;
    let mapData;
    let countries;
    
    return {
        oninit: async () => {
            mapData = await m.request(url);
            countries = topojson.feature(mapData, mapData.objects.countries);
            const projection = d3.geoEqualEarth();
            
            height = getHeight(projection, width); // this will change projection
            path = d3.geoPath(projection, context);
        },
        oncreate: (vnode) => {
            const canvas = vnode.dom;
            context = canvas.getContext("2d");
        },
        onupdate: (vnode) => {
            if (!countries) {
                return;
            }
            
            const selected = new Set((vnode.attrs.selected || []).map((countryCode) => 
                CountryCodes.get(countryCode)
            ));
    
    
            context.fillStyle = Colors.Selected;
            context.strokeStyle = Colors.Border;
            for (const country of countries.features) {
                context.beginPath();
                path(country);
                if (selected.has(country.properties.name)) {
                    context.fill();
                } else {
                    context.stroke();
                }
            }
            // draw inner borders
            context.strokeStyle = Colors.InnerBorder;
            context.beginPath();
            path(topojson.mesh(mapData, mapData.objects.countries, (a, b) => a !== b));
            // path(topojson.mesh(mapData));
            context.stroke();
        },
        view: () => (
            <canvas width={ width } height={ height }></canvas>
        )
    };
}

function getHeight(projection, width) {
    const outline = ({ type: "Sphere" });
    const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    return dy;
}