async function extractWhatsAppGroupMembers() {

    const members = [];
    const added = new Set();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function autoScroll() {

        const scrollBox = document.querySelector('[role="application"]');

        if (!scrollBox) return;

        for (let i = 0; i < 30; i++) {

            scrollBox.scrollBy(0, 1000);

            await sleep(500);
        }
    }

    await autoScroll();

    const allSpans = document.querySelectorAll("span");

    allSpans.forEach(span => {

        const text = span.innerText?.trim();

        if (!text) return;

        const phoneRegex = /\+\d[\d\s]{7,15}/;

        if (phoneRegex.test(text)) {

            const number = text.match(phoneRegex)[0];

            if (!added.has(number)) {

                added.add(number);

                let name = "No Name";

                const parent = span.closest("div");

                if (parent) {

                    const spans = parent.querySelectorAll("span");

                    spans.forEach(s => {

                        const t = s.innerText?.trim();

                        if (
                            t &&
                            t !== number &&
                            !t.includes("+")
                        ) {
                            name = t;
                        }
                    });
                }

                members.push({
                    name,
                    number
                });
            }
        }
    });

    console.log(members);

    if (members.length === 0) {

        alert("No members found! Open group info and scroll members list.");

        return;
    }

    let csv = "Name,Number\n";

    members.forEach(m => {
        csv += `"${m.name}","${m.number}"\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "whatsapp_members.csv";

    a.click();

    alert(`Downloaded ${members.length} members!`);
}

setTimeout(() => {

    extractWhatsAppGroupMembers();

}, 5000);
