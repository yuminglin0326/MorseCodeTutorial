$(document).ready(function() {
    let spaceDownTime = 0;
    let spaceDown = false;
    let duration = 0;
    let morseAudio = new Audio('/static/audio/morse_code_T.mp3');
    let submitted = false;
    let isCorrect = false;
    let inCorrectCount = 0;
    let quizType = quiz["type"];

    // display quiz question based on quiz type
    if (quizType === "eng_to_morse") {
        $('#duration-display').show();
        // display input box as div
        let inputbox = $("<div class='input-morse-code'>");
        $('#quiz-mid-container').append(inputbox);

        // display flashlight
        let flashlightContainer = $("<div class='flashlight-container'>");
        let flashlight = $("<img class='flashlight' src='/static/image/led off.png' alt='led light off'>")
        flashlightContainer.append(flashlight);
        $('#quiz-mid-container').after(flashlightContainer);
        console.log("english to morse");
    } else if (quizType === "flashlight_to_eng") {
        // display input box as input
        let inputbox = $("<input class='input-morse-code' type='text'>");
        $('#quiz-mid-container').append(inputbox);
        inputbox.focus();

        // display flashlight
        let flashlightContainer = $("<div class='flashlight-container extra-margin'>");
        let flashlightOff = $("<img class='flashlight-off hide' src='/static/image/led off.png' alt='led light off'>")
        let flashlightOn = $("<img class='flashlight-on hide' src='/static/image/led on.png' alt='led light on'>")
        flashlightContainer.append(flashlightOff, flashlightOn);
        $('.question').after(flashlightContainer);
        playFlashlight(quiz["flash_interval"]);

        // replay button
        let replayButton = $("<button id='replay-button' class='btn btn-secondary'>").text("Replay");
        $('.flashlight-container').after(replayButton);

        // change input font size
        $('.input-morse-code').css("font-size", "20px");
        console.log("flashlight to english");
    }

    // allow user to enter morse code by pressing space key if the type is eng_to_morse
    if (quizType === "eng_to_morse") {
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
                    if (duration < 200) {
                        console.log("dot duration: " + duration);
                        $('.input-morse-code').append('.');
                    } else if (duration > 200 && duration < 500) {
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
    }
    
    // function to play flashlight
    function playFlashlight(intervals) {
        $('.flashlight-on').show();
        for (let i = 0; i < intervals.length; i++) {
            let time = intervals[i];
            if (i % 2 == 0) {
                setTimeout(function() {
                    $('.flashlight-on').hide();
                    $('.flashlight-off').show();
                    
                }, time);
            } else {
                setTimeout(function() {
                    $('.flashlight-off').hide();
                    $('.flashlight-on').show();
                    
                }, time);
            }
        }
    };

    // replay flashlight button
    $('#replay-button').click(function() {
        $('.input-morse-code').focus();
        playFlashlight(quiz["flash_interval"]);
    });

    // display submit button when user types morse code
    $(document).keyup(function(e) {
        console.log($('.input-morse-code').val())
        if ($('.input-morse-code').val().trim() !== '') {
            // show submit button
            if ($('#submitAnswer').hasClass('hide')) {
                $('#submitAnswer').removeClass('hide');
            }
        } else {
            if (!$('#submitAnswer').hasClass('hide')) {
                $('#submitAnswer').addClass('hide');
            }
        }
    });

    // submit answer
    $('#submitAnswer').click(function(e) {
        e.stopPropagation();
        submitted = true;
        let answer = "";

        // get answer and correct answer based on quiz type
        if (quizType === "eng_to_morse") {
            answer = $('.input-morse-code').text();
            correctAnswer = quiz["answer_morse"];
        } else if (quizType === "flashlight_to_eng") {
            answer = $('.input-morse-code').val();
            answer = answer.trim().toLowerCase();
            correctAnswer = quiz["answer_letter"];
        }

        if (answer === correctAnswer) { // if answer is correct
            console.log("Correct!");

            isCorrect = true;
            // add feedback messages when answer is correct
            let feedback = $("<div class='feedback'>").html("Correct!").addClass("quiz-correct");
            let continueMessage = $("<div class='continue-message'>").html("Click anywhere to continue");
            $('#answer-feedback-container').append(feedback, continueMessage);
            $('#submitAnswer').addClass('hide');

            // send answer to server
            let inputAnswer = {
                "id": quiz["id"],
                "answer": answer,
                "is_correct": true,
                "type": quizType
            }
            sendAnswer(inputAnswer);
        } else { // if answer is incorrect
            console.log("Incorrect!");
            inCorrectCount += 1;
            // add feedback messages when answer is incorrect
            let feedback = $("<div class='feedback'>")
            feedback.html("Incorrect!").addClass("quiz-wrong");
            $('#answer-feedback-container').append(feedback);
            $('#submitAnswer').addClass('hide');

            // show hint and correct answer button if it's the first incorrect answer
            if (inCorrectCount < 2) {
                $('#hint-button').removeClass('hide');
                $('#correct-answer-button').removeClass('hide');
            } else {
                let continueMessage = $("<div class='continue-message'>").html("Click anywhere to see the correct answer");
                $('#answer-feedback-container').append(continueMessage);
            }
            
            // send answer to server
            let inputAnswer = {
                "id": quiz["id"],
                "answer": answer,
                "is_correct": false,
                "type": quizType
            }
            
            sendAnswer(inputAnswer);
        }
    });

    // function to send answer to server
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
            if (nextQuiz > total_quizzes) {
                window.location.href = "/quiz/score";
            } else {
                window.location.href = "/quiz/" + nextQuiz;
            }
        } else if (submitted && inCorrectCount >= 2) {
            window.location.href = "/quiz_answer/" + quiz["id"];
        }
    });

    // hint button
    $('#hint-button').click(function() {
        let hint = "";
        if (quizType === "eng_to_morse") {
            hint = $("<img class='hint'>").attr("src", quiz["hint"]);
            $('.input-morse-code').after(hint);
            $('.input-morse-code').text('');
        } else if (quizType === "flashlight_to_eng") {
            hint = $("<div class='hint'>").text(quiz["hint"]);
            $('.flashlight-container').after(hint);
            $('.input-morse-code').val('');
        }
        $('#hint-button').addClass('hide');
        $('#correct-answer-button').addClass('hide');
        $('#answer-feedback-container').empty();
        
        submitted = false;
    });

    // correct answer button
    $('#correct-answer-button').click(function() {
        window.location.href = "/quiz_answer/" + quiz["id"];
    });

    
});