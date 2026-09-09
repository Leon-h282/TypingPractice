

<h1 align=center>TYPING PRACTICE</h1>

## Description
This is a typing practice site where user practice typing within a selected time limit. There are 3 time limit options: `10s`, `30s`, and `60s`. Typing errors will be displayed redish. When time is up, user will see their typing speed, `WPS`, on the screen.

<img width="800" height="450" alt="TypingPractice" src="https://github.com/user-attachments/assets/36992ab9-1782-45d8-a527-1c0e80f402a4"/>

## Pipeline
- Get random words from `english_1k.json`.
- Start timer when user start typing/
- **Compare** with hidden input content.
- Highlight **typed** words and **errors**.
- Show `WPM` result.


## Words source
`english_1k.json` from `Monkeytype`:
https://github.com/monkeytypegame/monkeytype/blob/master/frontend/static/languages/english_1k.json

## GitHub page
https://leon-h282.github.io/TypingPractice/
