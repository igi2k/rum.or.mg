const url = "https://script.google.com/macros/s/AKfycbyp9zClExazW8GFLfK5FUkVNHsFnAqzr_3y5Wfq/exec";

fetch(url).then(async (response) => {
    const item = await response.json();
    if (!item) {
        return;
    }

    const root = document.getElementById("latest");
    const title = document.createElement("div");
    const image = document.createElement("img");
    
    title.innerText = item.name;
    image.src = item.image;
    if (image.referrerPolicy) {
        image.referrerPolicy = "no-referrer"
    }
    
    root.append(title, image);

}).catch((error) => console.error(error));