async function startExtractor() {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function autoScrollMembers() {

        const popup = document.querySelector('[aria-label="Search members"]');

        if (!popup) {
            alert("Open members popup first!");
            return false;
        }

        let scrollBox = popup.parentElement;

        for (let i = 0; i < 15; i++) {

            scrollBox.scrollBy(0, 1000);

            await sleep(700);
        }

        return true;
    }

    const ok = await autoScrollMembers();

    if (!ok) return;

    const members = [];
    const added = new Set();

    const rows = document.querySelectorAll("div[role='listitem']");

    rows.forEach(row => {

        const text = row.innerText;

        if (!text) return;

        const phoneMatch = text.match(/\+\d[\d\s]{7,15}/);

        if (!phoneMatch) return;

        const number = phoneMatch[0].trim();

        if (added.has(number)) return;

        added.add(number);

        const lines = text.split("\n");

        let name = "No Name";

        if (lines.length > 0) {

            const firstLine = lines[0].trim();

            if (
                firstLine &&
                !firstLine.includes("+")
            ) {
                name = firstLine;
            }
        }

        members.push({
            name,
            number
        });
    });

    console.log(members);

    if (members.length === 0) {

        alert("No members detected!");

        return;
    }

    let csv = "Name,Number\n";

    members.forEach(member => {

        csv += `"${member.name}","${member.number}"\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "whatsapp_members.csv";

    a.click();

    alert(`Downloaded ${members.length} members`);
}

setTimeout(() => {

    startExtractor();

}, 5000);
