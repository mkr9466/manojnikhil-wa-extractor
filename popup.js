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


    // FIND MEMBERS POPUP

    const popup = document.querySelector('[aria-label="Search members"]');

    if (!popup) {

        alert("Open 'View all members' popup first!");

        return;
    }


    // FIND REAL MEMBERS LIST

    let scrollContainer = null;

    const allScrollable = document.querySelectorAll('div');

    allScrollable.forEach(div => {

        if (
            div.scrollHeight > div.clientHeight &&
            div.innerText.includes('+')
        ) {
            scrollContainer = div;
        }
    });


    if (!scrollContainer) {

        alert("Members list not found!");

        return;
    }


    console.log("FOUND SCROLL CONTAINER");


    // SCROLL TILL END

    let lastScrollTop = -1;

    for (let i = 0; i < 200; i++) {

        scrollContainer.scrollTop += 5000;

        await sleep(1500);

        console.log("Scrolling...", i);


        // STOP WHEN END REACHED

        if (scrollContainer.scrollTop === lastScrollTop) {

            console.log("Reached bottom");

            break;
        }

        lastScrollTop = scrollContainer.scrollTop;
    }


    // EXTRA WAIT FOR FINAL LOAD

    await sleep(4000);


    // EXTRACT MEMBERS

    const members = [];

    const added = new Set();


    const rows = document.querySelectorAll("div[role='listitem']");


    rows.forEach(row => {

        const text = row.innerText;

        if (!text) return;


        // PHONE

        const phoneMatch = text.match(/\+\d[\d\s]{7,20}/);

        if (!phoneMatch) return;


        const number = phoneMatch[0]
            .replace(/\s+/g, "")
            .trim();


        // DUPLICATE CHECK

        if (added.has(number)) return;

        added.add(number);


        // NAME

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


    console.log("TOTAL MEMBERS:", members.length);

    console.log(members);


    if (members.length === 0) {

        alert("No members found!");

        return;
    }


    // CREATE CSV

    let csv = "Name,Number\n";


    members.forEach(member => {

        csv += `"${member.name}","${member.number}"\n`;

    });


    // DOWNLOAD

    const blob = new Blob([csv], {
        type: "text/csv"
    });


    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "whatsapp_members.csv";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);


    alert(`Downloaded ${members.length} members`);
}
