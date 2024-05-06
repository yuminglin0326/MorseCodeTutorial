$(document).ready(function() {
    // console.log(all_quizzes)
    function renderProgressBar() {
        for (let i = 1; i <= total_quizzes; i++) {
            cur_quiz = all_quizzes[i]
            answered_correctly = cur_quiz["answered_correctly"]
            if (answered_correctly == 0) {
                continue;
            }
    
            let progressBar = $("<div class='progress-bar'>");
            progressBar.attr('style', 'width: 10%');
            if (answered_correctly == -1 || answered_correctly == -2) {
                progressBar.addClass('wrong-progress');
            } else if (answered_correctly == 2) {
                progressBar.addClass('hint-correct-progress');
            } else {
                progressBar.addClass('correct-progress');
            }
            $('.progress').append(progressBar);
        }
    }
    renderProgressBar()
    
    
});