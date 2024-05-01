$(document).ready(function() {
    let spaceDownTime = 0;
    let spaceDown = false;
    let duration = 0;
    let morseAudio = new Audio('/static/audio/t-audio.mp3');
    let submitted = false;
    let isCorrect = false;
    let inCorrectCount = 0;
    let quizType = quiz["type"];

    // display quiz question based on quiz type
    if (quizType === "eng_to_morse") {
        $('#duration-display').show();
        // display the instruction on entering space
        if (quiz["answer_letter"].length > 1) {
            let instruction = $("<div class='subtitle text-center'>").html("Press Tab to enter space between letters");
            $('.question').after(instruction);
        }

        // display input box as div
        let inputbox = $("<div class='input-morse-code'>");
        $('#quiz-mid-container').append(inputbox);

        // display flashlight
        let flashlightContainer = $("<div class='flashlight-container'>");
        let flashlight = $("<img class='flashlight' src='/static/image/led off.png' alt='led light off'>")
        flashlightContainer.append(flashlight);
        // $('#quiz-mid-container').after(flashlightContainer);
        $('.flashlight-col').append(flashlightContainer);
        // console.log("english to morse");
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

        // display the instruction on replaying flashlight
        let instruction = $("<div class='subtitle text-center'>").html("Click on the flashlight to replay the morse code");
        $('.flashlight-container').before(instruction);

        // replay button
        // let replayButton = $("<button id='replay-button' class='btn btn-secondary'>").text("Replay");
        // $('.flashlight-container').after(replayButton);

        // change input font size
        $('.input-morse-code').css("font-size", "20px");
        // console.log("flashlight to english");
    } else if (quizType === "audio_to_eng") {
        // Check if there's an audio file specified for the quiz
        if (quiz["morse_audio"]) {
            let audioFilePath = quiz["morse_audio"];
            // Display the Morse code audio player with the specified audio file
            // $('#audio-player').append("<audio controls><source src='" + audioFilePath + "' type='audio/mpeg'></audio>");
            // $('.question').after("<audio controls class='quiz-audio'><source src='" + audioFilePath + "' type='audio/mpeg'></audio>")
            let audioPlayer = $("<div class='quiz-audio'>");
            audioImg = $("<img src='/static/image/audio-off.png' alt='audio'>");
            audioPlayer.append(audioImg);
            $('.question').after(audioPlayer);
            console.log("morse audio to English");

            // play audio when user clicks on the audio image
            $('.quiz-audio').click(function() {
                let audio = new Audio(audioFilePath);
                audio.play();
                audioPlayer.empty();
                audioImg = $("<img src='/static/image/audio-on.png' alt='audio'>");
                audioPlayer.append(audioImg);
                $(audio).on('ended', function() {
                    // Audio playback has ended
                    console.log('Audio playback finished.');
                    audioPlayer.empty();
                    audioImg = $("<img src='/static/image/audio-off.png' alt='audio'>");
                    audioPlayer.append(audioImg);
                    // Add your desired functionality here
                });
            });
            

            // Add input box for user's answer
            let inputbox = $("<input class='input-morse-code' type='text'>");
            $('#quiz-mid-container').append(inputbox);
            inputbox.focus();

            // change input font size
            $('.input-morse-code').css("font-size", "20px");
        } else {
            console.log("Error: No audio file specified for the quiz.");
        }
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
            else if (e.which === 9 && !submitted) { // Check if the pressed key is the tab key
                e.preventDefault();
                // Add a space character to input-morse-code
                $('.input-morse-code').append(' ');
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
                            $('.quiz-bottom-container').append(error);
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
        // console.log("flashlight on");
        for (let i = 0; i < intervals.length; i++) {
            let time = intervals[i];
            if (i % 2 == 0) {
                setTimeout(function() {
                    $('.flashlight-on').hide();
                    $('.flashlight-off').show();
                    // console.log("flashlight off", time);
                }, time);
            } else {
                setTimeout(function() {
                    $('.flashlight-off').hide();
                    $('.flashlight-on').show();
                    // console.log("flashlight on", time);
                }, time);
            }
        }
    };

    // replay flashlight button
    // $('#replay-button').click(function() {
    $('.flashlight-container').click(function() {
        $('.input-morse-code').focus();
        playFlashlight(quiz["flash_interval"]);
    });

    // display submit button when user types morse code
    $(document).keyup(function(e) {
        console.log($('.input-morse-code').val())
        if ($('.input-morse-code').val().trim() !== '' && !submitted) {
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
        $('.input-morse-code').attr('disabled', 'disabled');

        // get answer and correct answer based on quiz type
        if (quizType === "eng_to_morse") {
            answer = $('.input-morse-code').text();
            correctAnswer = quiz["answer_morse"];
        } else if (quizType === "flashlight_to_eng") {
            answer = $('.input-morse-code').val();
            answer = answer.trim().toLowerCase();
            correctAnswer = quiz["answer_letter"];
        } else if (quizType === "audio_to_eng") {
            answer = $('.input-morse-code').val();
            answer = answer.trim().toLowerCase();
            correctAnswer = quiz["answer_letter"]
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

    let all_answered_correctly = [];
    // function to send answer to server
    function sendAnswer(inputAnswer) {
        $.ajax({
            type: "POST",
            url: "/answered_quiz",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(inputAnswer),
            success: function(result) {
                all_answered_correctly = result["all_answered_correctly"];
                renderProgressBar();
            }
        })
    }

    function renderProgressBar() {
        $('.progress').empty();   
        for (let i = 0; i < total_quizzes; i++) {
            answered_correctly = all_answered_correctly[i]
            if (answered_correctly == 0) {
                continue;
            }
    
            let progressBar = $("<div class='progress-bar'>");
            progressBar.attr('style', 'width: 10%');
            if (answered_correctly == -1 || answered_correctly == -2) {
                progressBar.addClass('bg-danger');
            } else if (answered_correctly == 2) {
                progressBar.addClass('bg-warning');
            } else if (answered_correctly == 1){
                progressBar.addClass('bg-success');
            }
            $('.progress').append(progressBar);
        }
        return true;
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
        gotHint = true;
        if (quizType === "eng_to_morse") {
            hintContainer = $("<div class='hint-container'>");
            if (Array.isArray(quiz["hint"])) {
                for (let i = 0; i < quiz["hint"].length; i++) {
                    hint = $("<img class='hint'>").attr("src", quiz["hint"][i]);
                    hintContainer.append(hint);
                }
            } else {
                hint = $("<img class='hint'>").attr("src", quiz["hint"]);
                hintContainer.append(hint);
            }
            $('.input-morse-code').after(hintContainer);
            $('.input-morse-code').text('');
        } else if (quizType === "flashlight_to_eng") {
            hint = $("<div class='hint'>").text(quiz["hint"]);
            $('.flashlight-container').after(hint);
            $('.input-morse-code').val('');
        } else if (quizType === "audio_to_eng") {
            hint = $("<div class='hint'>").text(quiz["hint"]);
            $('.quiz-audio').after(hint);
            $('.input-morse-code').val('');
        }
        $('#hint-button').addClass('hide');
        $('#correct-answer-button').addClass('hide');
        $('#answer-feedback-container').empty();
        $('.input-morse-code').removeAttr('disabled').focus();
        
        submitted = false;
    });

    // correct answer button
    $('#correct-answer-button').click(function() {
        window.location.href = "/quiz_answer/" + quiz["id"];
    });

    
});
