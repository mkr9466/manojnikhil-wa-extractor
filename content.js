function extractMembers() {

    const members = [];

    const addedNumbers = new Set();

    document.querySelectorAll("span[title]").forEach(el => {

        const text = el.getAttribute("title");

        if (/^\+?\d[\d\s]+$/.test(text)) {

            const number = text.trim();

            if (!addedNumbers.has(number)) {

                addedNumbers.add(number);

                let name = "No Name";

                const parent = el.parentElement;

                if (parent) {

                    const spans = parent.querySelectorAll("span");

                    spans.forEach(s => {

                        const possibleName = s.getAttribute("title");

                        if (
                            possibleName &&
                            possibleName !== number &&
                            !possibleName.includes("+")
                        ) {
                            name = possibleName;
                        }
                    });
                }

                members.push({
                    name: name,
                    number: number
                });
            }
        }
    });

    console.log(members);

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

    alert("Excel CSV Downloaded!");
}

setTimeout(extractMembers, 5000);
