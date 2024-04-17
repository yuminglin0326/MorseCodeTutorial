$(document).ready(function() {
    ans_letter = quiz["answer_letter"]
    let audio = new Audio('/static/audio/morse_code_'+ ans_letter +'.mp3');
    audio.play();

    // navigate to the next quiz when the user clicks anywhere on the page
    $(document).click(function() {
        let nextQuiz = quiz["id"] + 1;
        window.location.href = "/quiz/" + nextQuiz;
    });
});