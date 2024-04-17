$(document).ready(function() {
    let spaceDownTime = 0;
    let spaceDown = false;
    let duration = 0;
    let morseAudio = new Audio('/static/audio/morse_code_T.mp3');
    let submitted = false;
    let isCorrect = false;
    let inCorrectCount = 0;

    $(document).keydown(function(e) {
        if (e.which === 32 && !spaceDown && !submitted) { // Check if the pressed key is the space key
            spaceDownTime = Date.now();
            displayDuration();
            $('#duration-display').text('0 seconds');
            spaceDown = true;
            playAudio();

            // turn on flashlight
            $('.flashlight-container').empty();
            $('.flashlight-container').append('<img class="flashlight" src="/static/image/led on.png">')
          } else if (e.which === 8 && !submitted) { // Check if the pressed key is the backspace key
            // Remove the last character from input-morse-code
            let text = $('.input-morse-code').text();
            $('.input-morse-code').text(text.slice(0, -1));
            if (text.length === 1 && !$('#submitAnswer').hasClass('hide')) {
                $('#submitAnswer').addClass('hide');
            }
        }
    });

    $(document).keyup(function(e) {
        if (e.which === 32 && spaceDown) {
            spaceDown = false;
            clearInterval(audioTimer);
            morseAudio.pause();
            spaceDownTime = 0;

            // turn off flashlight
            $('.flashlight-container').empty();
            $('.flashlight-container').append('<img class="flashlight" src="/static/image/led off.png">')
          }
    });

    function displayDuration() {
        let isError = false;
        intervalId = setInterval(function() {
            if (spaceDown) {
              duration = Date.now() - spaceDownTime;
              $('#duration-display').text(duration/1000 + ' seconds');
            } else {
                $('.error').remove();
                if (duration < 150) {
                    console.log("dot duration: " + duration);
                    $('.input-morse-code').append('.');
                } else if (duration > 150 && duration < 500) {
                    console.log("dash duration: " + duration);
                    $('.input-morse-code').append('-');
                } else {
                    let error = $("<div class='error'>")
                    error.html("try enter the morse code again!")
                    if (!isError) {
                        isError = true;
                        $('.input-morse-code').after(error);
                    }
                }
                clearInterval(intervalId); 

                // Check if input-morse-code is not empty
                if ($('.input-morse-code').text().trim() !== '') {
                    // show submit button
                    if ($('#submitAnswer').hasClass('hide')) {
                        $('#submitAnswer').removeClass('hide');
                    }
                }
            }
          }, 10);
    }

    function playAudio() {
        morseAudio.currentTime = 0; // Reset audio to the beginning
        morseAudio.play();
        // Set a timeout to stop audio playback after 500 milliseconds
        audioTimer = setTimeout(function() {
            morseAudio.pause();
        }, 500);
    }

    $('#submitAnswer').click(function(e) {
        e.stopPropagation();
        submitted = true;
        let answer = $('.input-morse-code').text();
        if (answer === quiz["answer_morse"]) {
            console.log("Correct!");

            isCorrect = true;
            // add feedback messages when answer is correct
            let feedback = $("<div class='feedback'>").html("Correct!").addClass("quiz-correct");
            let continueMessage = $("<div class='continue-message'>").html("Click anywhere to continue");
            $('#answer-feedback-container').append(feedback, continueMessage);
            $('#submitAnswer').addClass('hide');

            // send answer to server
            let inputAnswer = {
                "answer": answer,
                "is_correct": true
            }
            sendAnswer(inputAnswer);
        } else {
            console.log("Incorrect!");
            inCorrectCount += 1;
            let feedback = $("<div class='feedback'>")
            feedback.html("Incorrect!").addClass("quiz-wrong");
            $('#answer-feedback-container').append(feedback);
            $('#submitAnswer').addClass('hide');
            if (inCorrectCount < 2) {
                $('#hint-button').removeClass('hide');
                $('#correct-answer-button').removeClass('hide');
            } else {
                let continueMessage = $("<div class='continue-message'>").html("Click anywhere to see the correct answer");
                $('#answer-feedback-container').append(continueMessage);
            }
            

            // send answer to server
            let inputAnswer = {
                "answer": answer,
                "is_correct": false
            }
            
            sendAnswer(inputAnswer);
        }
    });

    sendAnswer = function(inputAnswer) {
        $.ajax({
            type: "POST",
            url: "/answered_quiz",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(inputAnswer),
            success: function(result) {
                console.log(result);
            }
        })
    }

    // navigate to next quiz when user clicks anywhere after the quiz is answered correctly
    $(document).click(function() {
        if (submitted && isCorrect) {
            let nextQuiz = quiz["id"] + 1;
            window.location.href = "/quiz/" + nextQuiz;
        } else if (submitted && inCorrectCount >= 2) {
            window.location.href = "/quiz_answer/" + quiz["id"];
        }
    });

    $('#hint-button').click(function() {
        let hint = $("<img class='hint'>").attr("src", quiz["hint"]);
        $('.input-morse-code').after(hint);
        $('#hint-button').addClass('hide');
        $('#correct-answer-button').addClass('hide');
        $('#answer-feedback-container').empty();
        $('.input-morse-code').text('');
        submitted = false;
    });

    $('#correct-answer-button').click(function() {
        window.location.href = "/quiz_answer/" + quiz["id"];
    });

    
});