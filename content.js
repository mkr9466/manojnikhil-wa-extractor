function extractNumbers() {

    const numbers = new Set();

    document.querySelectorAll("span[title]").forEach(el => {

        const text = el.getAttribute("title");

        if (/^\+?\d[\d\s]+$/.test(text)) {
            numbers.add(text);
        }
    });

    console.log([...numbers]);

    const blob = new Blob(
        [[...numbers].join("\n")],
        { type: "text/plain" }
    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "numbers.txt";

    a.click();

    alert("Numbers downloaded!");
}

setTimeout(extractNumbers, 5000);
