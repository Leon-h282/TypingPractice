

const textBox       = document.getElementById("text-box");
const hiddenInput   = document.getElementById("hidden-input");
const typingContent = document.getElementById("typing-content");

const maxLength   = 30;
let displayedList = [];
let typedList = [];
let wordList  = {"words": []}; 
let currentWordIndex = 0;
let charCounted = 0;

const cursor = document.createElement("span");
cursor.id = "cursor";

countdownDisplay   = document.getElementById("countdown")
let timeSelection  = document.getElementById("select-time");
let totalSecond    = Number(timeSelection.value);
let startCountdown = false;
let remain = totalSecond;
let countdownTimer = null;


timeSelection.addEventListener("change", () => {
    totalSecond = Number(timeSelection.value);
    remain = totalSecond;

    countdownDisplay.textContent = `${remain}s`;
});


fetch("./english_1k.json")
    .then(res => res.json())
    .then(data => {
        wordList = data;
        initTyping();
    });


function initTyping() {
    displayedList     = [];
    currentWordIndex  = 0;
    hiddenInput.value = "";
    hiddenInput.disabled = false;

    remain = totalSecond;
    startCountdown = false;
    charCounted = 0;

    countdownDisplay.textContent = `${remain}s`;

    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }

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
    updateCursor();
}


function updateCursor() {
    const wordElements  = typingContent.querySelectorAll(".word");
    const currentWordEl = wordElements[currentWordIndex];

    const chars = currentWordEl.querySelectorAll(".char");
    const pos   = hiddenInput.value.length;

    const containerRect = typingContent.getBoundingClientRect();
    let targetRect;
    let atEnd = false;

    if (pos < chars.length) {
        targetRect = chars[pos].getBoundingClientRect();
    } else if (chars.length > 0) {
        targetRect = chars[chars.length - 1].getBoundingClientRect();
        atEnd = true;
    } else {
        targetRect = currentWordEl.getBoundingClientRect();
    }

    const left = atEnd ? targetRect.right : targetRect.left;

    cursor.style.left   = `${left - containerRect.left}px`;
    cursor.style.top    = `${targetRect.top - containerRect.top}px`;
    cursor.style.height = `${targetRect.height}px`;

    if (cursor.parentElement !== typingContent) {
        typingContent.appendChild(cursor);
    }
}


function finished() {
    hiddenInput.disabled = true;
    cursor.style.opacity = 0;
    const WPM = Math.round(((charCounted/5)/(totalSecond/60)));
    typingContent.textContent = `${WPM} WPM`
}


function startTimer() {
    if (countdownTimer) return;

    remain --;
    countdownDisplay.textContent = `${remain}s`;
    
    countdownTimer = setInterval(() => {
        if (startCountdown) {
            remain--;
            countdownDisplay.textContent = `${remain}s`;
        
            if (remain <= 0) {
                finished();
                clearInterval(countdownTimer);
            }
        }
    }, 1000);
}


textBox.addEventListener("click", () => {
    initTyping();
    hiddenInput.focus();
});
window.addEventListener("load", () => hiddenInput.focus());


hiddenInput.addEventListener("input", () => {
    const typed = hiddenInput.value;
    if (typed && ! startCountdown) {
        startCountdown = true;
        startTimer();
    }

    // Danh sách các từ hiện tại trên văn bản gốc
    const wordElements = typingContent.querySelectorAll(".word");

    // Từ đang được gõ trên văn bản gốc (DOM)
    const currentWordEl = wordElements[currentWordIndex];

    // Từ mẫu tương ứng (String)
    const targeWord = displayedList[currentWordIndex];

    // Danh sách các ký tự trong từ đang gõ
    const chars = currentWordEl.querySelectorAll(".char");

    updateCursor();

    // Nhấn space -> chuyển sang từ tiếp theo, không thể gõ lại
    if (typed.endsWith(" ")) {
        const typedTrimmed = typed.trim();

        chars.forEach((char, i) => {
            if (i >= typedTrimmed.length) {
                char.style.color   = "red";
                char.style.opacity = 0.5;
            }
        })

        if (typedTrimmed === targeWord) {
            charCounted += typedTrimmed.length + 1;
        }

        currentWordIndex ++;    // tăng index để chuyển sang từ mói
        hiddenInput.value = ""; // reset input value

        // Reset văn bản mới khi đã gõ đủ số từ
        if (currentWordIndex >= maxLength) {
            initTyping();
        }

        updateCursor();
        return;
    }

    // Trong khi đang gõ chữ
    if (currentWordIndex < maxLength) {
        // Luôn luôn reset về màu gốc
        chars.forEach(char => {
            char.style.color = "rgba(179, 178, 178, 0.465)";
            char.style.opacity = 1;
        });

        // Highlight đúng sai
        if (typed.length <= targeWord.length) {
            for (let i=0; i<typed.length; i++) {
                if (typed[i] === targeWord[i]) {
                    chars[i].style.color = "yellow"; // Đúng
                } else {
                    chars[i].style.color = "red";    // Sai
                    chars[i].style.opacity = 0.5;
                }
            }
        } else {
            for (let i=0; i<typed.length; i++) {
                chars[i].style.color = "red";
                chars[i].style.opacity = 0.5;
            }
        }
    }
});
