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

    // CORRECT SCROLL CONTAINER
    let scrollContainer = popup.closest("div[tabindex='-1']");

    if (!scrollContainer) {
        scrollContainer = popup.parentElement;
    }

    let lastHeight = 0;

    // AUTO SCROLL
    for (let i = 0; i < 50; i++) {

        scrollContainer.scrollBy(0, 2000);

        await sleep(1000);

        const newHeight = scrollContainer.scrollHeight;

        if (newHeight === lastHeight) {
            break;
        }

        lastHeight = newHeight;
    }

    // EXTRA WAIT
    await sleep(2000);

    const members = [];
    const added = new Set();

    const allText = document.querySelectorAll("div[role='listitem']");

    allText.forEach(row => {

        const text = row.innerText;

        if (!text) return;

        const phoneMatch = text.match(/\+\d[\d\s]{7,15}/);

        if (!phoneMatch) return;

        const number = phoneMatch[0].trim();

        if (added.has(number)) return;

        added.add(number);

        const lines = text.split("\n");

        let name = "No Name";

        if (
            lines[0] &&
            !lines[0].includes("+")
        ) {
            name = lines[0].trim();
        }

        members.push({
            name,
            number
        });
    });

    console.log(members);

    if (members.length === 0) {

        alert("No members found!");

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
