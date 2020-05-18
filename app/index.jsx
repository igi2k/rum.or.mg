import m from "mithril";
import { LatestAddition } from "./latest-addition.jsx";

const url = "https://script.google.com/macros/s/AKfycbyp9zClExazW8GFLfK5FUkVNHsFnAqzr_3y5Wfq/exec";

function Layout() {
    return {
        view: () => (
            <>
                <h1>Zdarec</h1>
                <LatestAddition url={url} />
            </>
        )
    }
}

m.mount(document.body, Layout)