

const textBox       = document.getElementById("text-box");
const hiddenInput   = document.getElementById("hidden-input");
const typingContent = document.getElementById("typing-content");

const maxLength   = 10;
let displayedList = [];
let typedList = [];
let wordList = {"words": []}; 


fetch("./english_1k.json")
    .then(res => res.json())
    .then(data => {
        wordList = data;
        initTyping();
    });


function initTyping() {
    displayedList = [];
    while (displayedList.length < maxLength && wordList.words.length > 0) {
        getRandomWord();
    }
    mapTypingContent();
}

function getRandomWord() {
    word = wordList.words[
        Math.floor(Math.random() * wordList.words.length)
    ];
    displayedList.push(word);
};


function mapTypingContent() {
    let text = displayedList.join(" ");
    if (wordList.words.length) {
        typingContent.innerHTML = [...text]
            .map(char => `<span class="char">${char}</span>`)
            .join("");
    }
}


textBox.addEventListener("click", () => hiddenInput.focus());
window.addEventListener("load", () => hiddenInput.focus());

hiddenInput.addEventListener("input", () => {
    const typed = hiddenInput.value;
    const chars = textBox.querySelectorAll(".char");

    typedList = typed.trim().split(" ");
    console.log(typedList)
    console.log(typedList.length)

    if (typedList.length >= maxLength && typed.endsWith(" ")) {
        hiddenInput.value = "";
        initTyping();
        return;
    }

    chars.forEach((char, i) => {
        if (i < typed.length) {
            char.style.color = char.textContent === typed[i] ? "yellow" : "red";
        } else {
            char.style.color = "";
        }
    });
});
