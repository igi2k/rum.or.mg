import m from "mithril";
import { LatestAddition } from "./latest-addition/latest-addition.jsx";
import { SpiritMap } from "./map/spirit-map.jsx";
import "./index.less";

const Url = {
    LatestAddition: "https://script.google.com/macros/s/AKfycbyp9zClExazW8GFLfK5FUkVNHsFnAqzr_3y5Wfq/exec",
    Countries: "https://script.google.com/macros/s/AKfycbxaaTrAiZ5DA5u2Ztjbxmf2qQ8XvEBBJuTa3OEDL0Zg80CzFfdv/exec"
};

function Layout() {
    let rumCountries = [];
    return {
        oninit: async () => {
            rumCountries = await m.request(Url.Countries);
        },
        view: () => (
            <>
                <h1>Zdarec</h1>
                <LatestAddition url={ Url.LatestAddition } />
                <SpiritMap selected={ rumCountries }></SpiritMap>
            </>
        )
    };
}

m.mount(document.body, Layout);