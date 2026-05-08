# popup.js — FINAL VERSION

पूरा पुराना `popup.js` delete करके यह पूरा code paste करो 👇

```javascript
// BUTTON CLICK

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


// MAIN FUNCTION

async function extractMembers() {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // FIND MEMBERS POPUP

    const popup = document.querySelector('[aria-label="Search members"]');

    if (!popup) {

        alert("Open members popup first!");

        return;
    }


    // FIND REAL SCROLL AREA

    let scrollContainer = popup.closest('[role="dialog"]');

    if (!scrollContainer) {

        scrollContainer = popup.parentElement;
    }


    // SCROLL TO LOAD ALL MEMBERS

    let previousScrollTop = -1;

    for (let i = 0; i < 100; i++) {

        scrollContainer.scrollTop += 3000;

        await sleep(1200);

        // STOP WHEN NO MORE SCROLL

        if (scrollContainer.scrollTop === previousScrollTop) {
            break;
        }

        previousScrollTop = scrollContainer.scrollTop;
    }


    // EXTRA WAIT FOR WHATSAPP TO LOAD MEMBERS

    await sleep(3000);


    // EXTRACT MEMBERS

    const members = [];

    const added = new Set();


    // GET ALL VISIBLE TEXT BLOCKS

    const rows = document.querySelectorAll("div[role='listitem']");


    rows.forEach(row => {

        const text = row.innerText;

        if (!text) return;


        // FIND PHONE NUMBER

        const phoneMatch = text.match(/\+\d[\d\s]{7,20}/);

        if (!phoneMatch) return;


        const number = phoneMatch[0].replace(/\s+/g, "").trim();


        // REMOVE DUPLICATES

        if (added.has(number)) return;

        added.add(number);


        // GET NAME

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


    // IF NOTHING FOUND

    if (members.length === 0) {

        alert("No members found!");

        return;
    }


    // CREATE CSV

    let csv = "Name,Number\n";


    members.forEach(member => {

        csv += `"${member.name}","${member.number}"\n`;

    });


    // DOWNLOAD FILE

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
```

# IMPORTANT 😄

इसके बाद ये 3 चीजें जरूर करो:

## 1. SAVE करो

## 2. Chrome में जाओ

```text
chrome://extensions
```

## 3. Reload दबाओ 🔄

फिर:

* WhatsApp Web refresh
* Group open
* View all members
* Extract Members

अब auto scroll होना चाहिए और सारे members आने चाहिए 🙂
