import m from "mithril";
import "./latest-addition.less";

export function LatestAddition({ attrs }) {
    const { url } = attrs;
    let item;
    return {
        oninit: async () => {
            item = await m.request(url);
        },
        view: () => (
            <section id="latest">
                { item ? (<>
                    <div>{ item.name }</div>
                    <img referrerPolicy="no-referrer" src={ item.image }></img>
                </>) : null }
            </section>
        )
    };
}