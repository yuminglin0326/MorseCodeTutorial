$(document).ready(function() {
    ans_letter = quiz["answer_letter"]
    // let audio = new Audio(quiz["morse_audio"]);
    // audio.play();

    // navigate to the next quiz when the user clicks anywhere on the page
    $(document).click(function() {
        let nextQuiz = quiz["id"] + 1;
        if (nextQuiz > total_quizzes) {
            window.location.href = "/quiz/score";
        } else {
            window.location.href = "/quiz/" + nextQuiz;
        }
    });
});