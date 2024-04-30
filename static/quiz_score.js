$(document).ready(function() {
    // add buttons for review and restart
    let reviewButton = $("<button class='btn btn-primary'>Review</button>");
    let restartButton = $("<button class='btn btn-primary'>Restart</button>");
    let addedLetters = [];
    $('.score-btn-container').append(reviewButton, restartButton);

    // add event listeners for review
    reviewButton.click(function() {
        reviewBtnContainer = $("<div class='review-btn-container'>");
        keys = Object.keys(quizzes);
        need_review_list = [2, -1, -2]
        for (let i = 1; i <= keys.length; i++) {
            cur_quiz = quizzes[i];
            need_review = $.inArray(cur_quiz["answered_correctly"], need_review_list);
            if (need_review != -1) {
                addLetterBtn(reviewBtnContainer, cur_quiz["answer_letter"], cur_quiz["id_in_learns"]);
            }
        }
        // console.log(reviewBtnContainer);
        $('.score-btn-container').after(reviewBtnContainer);
    });

    function addLetterBtn(container, letters, learn_id) {
        for (let i = 0; i < letters.length; i++) {
            cur_letter = letters[i].toUpperCase();
            if ($.inArray(cur_letter, addedLetters) == -1) {
                addedLetters.push(cur_letter);
                let letterButton = $("<button class='btn btn-secondary'>"+ cur_letter +"</button>");
                container.append(letterButton);
                letterButton.click(function() {
                    reviewPath = "/learn/" + learn_id[i];
                    window.location.href = reviewPath;
                });
            }
        }
    }

    // add event listeners for restart
    restartButton.click(function() {
        window.location.href = "/quiz";
    });
});