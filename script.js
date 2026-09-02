let data = [];
let fuse;

fetch("numeri.csv")
.then(response => response.text())
.then(text => {

    const rows = text.trim().split("\n");

    rows.slice(1).forEach(row => {

        const cols = row.split(",");

        const numero = cols[0];

        const aliases = cols.slice(1)
        .filter(x => x.trim() !== "");

        data.push({
            numero,
            aliases,
            searchable: aliases.join(" ")
        });
    });

    fuse = new Fuse(data,{
        keys:["searchable"],
        threshold:0.4,
        includeScore:true
    });

});

const input = document.getElementById("searchInput");

input.addEventListener("input", () => {

    const query = input.value.trim();

    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "";

    if(query === "") return;

    const results = fuse.search(query);

    results.forEach(r => {

        const item = r.item;

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <div class="alias">${item.aliases.join(" • ")}</div>
            <div class="numero">${item.numero}</div>
        `;

        resultsDiv.appendChild(card);

    });

});
