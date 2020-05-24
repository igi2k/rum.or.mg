import m from "mithril";
import "./latest-addition.less";

const [width, height] = [300, 200];

const placeholderImageSrc = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"%3E%3C/svg%3E`;

export function LatestAddition({ attrs }) {
    const { url } = attrs;
    let item;
    return {
        oninit: async () => {
            item = await m.request(url);
        },
        view: () => (
            <section id="latest-addition">
                { item ? <Card item={ item }/> : null }
            </section>
        )
    };
}

function Card({ attrs }) {
    const { item } = attrs;
    let imageSrc = placeholderImageSrc;
    const update = (event) => {
        if (imageSrc !== item.image) {
            imageSrc = item.image;
        } else {
            event.redraw = false; //TODO: find better pattern for image placeholder
        }
    };
    return {
        view: () => (<>
            <div class="column">
                <div>
                    <div>{ item.name }</div>
                    <div>{ item.abv * 100 }% </div>
                    <div data-country={ item.country }></div>
                </div>
            </div>
            <div class="column">
                <div>
                    <img referrerPolicy="no-referrer" loading="lazy" 
                        src={ imageSrc } onload={ update } width={ width } height={ height }></img>                
                </div>
                <div data-volume={ item.volume }></div>
            </div>
        </>)
    };
}