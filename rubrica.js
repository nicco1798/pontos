fetch("numeri.csv")
.then(res => res.text())
.then(text => {

    const rows = text.trim().split("\n");

    let records = [];

    rows.slice(1).forEach(row => {

        const cols = row.split(",");

        const numero = cols[0];

        cols.slice(1).forEach(alias => {

            if(alias.trim() !== "")
            {
                records.push({
                    alias: alias.trim(),
                    numero
                });
            }

        });

    });

    records.sort((a,b)=>
        a.alias.localeCompare(b.alias,"it")
    );

    const div = document.getElementById("directory");

    records.forEach(r => {

        div.innerHTML += `
            <div class="item">
                <strong>${r.alias}</strong><br>
                ${r.numero}
            </div>
        `;

    });

});
