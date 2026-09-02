

const textBox       = document.getElementById("text-box");
const hiddenInput   = document.getElementById("hidden-input");
const typingContent = document.getElementById("typing-content");

const maxLength   = 10;
let displayedList = [];
let typedList = [];
let wordList = {"words": []}; 
let currentWordIndex = 0;


fetch("./english_1k.json")
    .then(res => res.json())
    .then(data => {
        wordList = data;
        initTyping();
    });


function initTyping() {
    displayedList = [];
    currentWordIndex = 0;
    hiddenInput.value = "";

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
    if (wordList.words.length) {
        typingContent.innerHTML = displayedList.map((word) => {
            let chars = [...word].map(char => `<span class="char">${char}</span>`).join("");
            return `<span class="word">${chars}</span>`;
        }).join('<span class="space"> </span>');
    }
}


textBox.addEventListener("click", () => hiddenInput.focus());
window.addEventListener("load", () => hiddenInput.focus());

hiddenInput.addEventListener("input", () => {
    const typed = hiddenInput.value;

    // Danh sách các từ hiện tại trên văn bản gốc
    const wordElements = typingContent.querySelectorAll(".word");

    // Từ đang được gõ trên văn bản gốc (DOM)
    const currentWordEl = wordElements[currentWordIndex];

    // Từ mẫu tương ứng (String)
    const targeWord = displayedList[currentWordIndex];

    // Danh sách các ký tự trong từ đang gõ
    const chars = currentWordEl.querySelectorAll(".char");

    // Nhấn space -> chuyển sang từ tiếp theo, không thể gõ lại
    if (typed.endsWith(" ")) {
        const typedTrimmed = typed.trim();

        chars.forEach((char, i) => {
            if (i >= typedTrimmed.length) {char.style.color = "red"}
        })

        currentWordIndex ++;    // tăng index để chuyển sang từ mói
        hiddenInput.value = ""; // reset input value

        // Reset văn bản mới khi đã gõ đủ số từ
        if (currentWordIndex >= maxLength) {
            initTyping();
        }
        return;
    }

    // Trong khi đang gõ chữ
    if (currentWordIndex < maxLength) {
        // Luôn luôn reset về màu gốc
        chars.forEach(char => {
            char.style.color = "rgba(179, 178, 178, 0.465)";
        });

        // Highlight đúng sai
        for (let i=0; i<typed.length; i++) {
            if (i < targeWord.length) {
                if (typed[i] === targeWord[i]) {
                    chars[i].style.color = "yellow"; // Đúng
                } else {
                    chars[i].style.color = "red";    // Sai
                }
            }
        }
    }
});
