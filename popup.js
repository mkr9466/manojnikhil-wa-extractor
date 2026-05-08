document.getElementById("extract").addEventListener("click", async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractMembers
    });

});

async function extractMembers() {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const popup = document.querySelector('[aria-label="Search members"]');

    if (!popup) {

        alert("Open members popup first!");

        return;
    }

    let scrollBox = popup.parentElement;

    for (let i = 0; i < 20; i++) {

        scrollBox.scrollBy(0, 1000);

        await sleep(700);
    }

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

        if (lines[0] && !lines[0].includes("+")) {
            name = lines[0];
        }

        members.push({
            name,
            number
        });
    });

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

    alert(`Downloaded ${members.length} members`);
}
