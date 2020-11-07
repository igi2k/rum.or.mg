import m from "mithril";
import * as d3 from "d3-geo";
import * as topojson from "topojson-client";
import { CountryCodes } from "../country-codes";

import "./spirit-map.less";

const url = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const Colors = {
    InnerBorder: "#FFFFFF",
    Border: "#C0C0C0",
    Selected: "#FF0000"
};

export function SpiritMap() {
    const outline = ({ type: "Sphere" });
    const projection = d3.geoEqualEarth();
    const path = d3.geoPath(projection);

    const width = 975;
    const height = getHeight(projection, outline, width); // this will change projection

    let mapData;
    let countries;
    
    return {
        oninit: async () => {
            mapData = await m.request(url);
            countries = topojson.feature(mapData, mapData.objects.countries);
        },
        view: ({ attrs }) => {
            if (!countries) {
                return;
            }
            const selected = new Set((attrs.selected || []).map((countryCode) => 
                CountryCodes.get(countryCode)
            ));
            const pathCountries = countries.features.map((feature) => {
                const name = feature.properties.name;
                let color;
                if (selected.has(name)) {
                    color = Colors.Selected;
                } else {
                    color = Colors.Border;
                }
                return (
                    <path fill={ color } d={ path(feature) } key={ name }>
                        <title>{ name }</title>
                    </path>
                );
            });
            const innerBordersPath = path(topojson.mesh(mapData, mapData.objects.countries, (a, b) => a !== b));
            return renderCountries(width, height, path(outline), pathCountries, innerBordersPath);
        }
    };
}

function renderCountries(width, height, outlinePath, pathCountries, innerBordersPath) {
    return m(`svg[viewBox='0 0 ${width} ${height}'][xmlns='http://www.w3.org/2000/svg'][xmlns:xlink='http://www.w3.org/1999/xlink']`,[
        m("defs", [
            m("path", { id: "outline", d: outlinePath }),
            m("clipPath", { id: "clip" }, [
                m("use", { "xlink:href": new URL("#outline", location) })
            ])
        ]),
        m("g", { clipPath: `url(${new URL("#clip", location)})` }, [
            m("use", { "xlink:href": new URL("#outline", location), fill: "white" }),
            m("g", pathCountries),
            m("path", { fill: "none", stroke: Colors.InnerBorder, strokeLinejoin: "round", d: innerBordersPath })
        ]),
        m("use", { "xlink:href": new URL("#outline", location), fill: "none", stroke: Colors.Border })
    ]);
}

function getHeight(projection, outline, width) {
    const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    return dy;
}