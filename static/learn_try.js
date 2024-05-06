$(document).ready(function() {
    let spaceDownTime = 0; // keep track of the time when the space key is pressed
    let spaceDown = false; // keep track of whether if the user is holding the space key
    let duration = 0; // keep track of the duration of space key press
    let morseAudio = new Audio('/static/audio/t-audio.mp3'); // morse code audio
    let morseImgId = 0; // keep track of index of the morse code being entered
    let submit = false // keep track of whether the user has submitted the answer
    let isCorrect = true; // keep track of whether the user has entered the correct morse code

    // press space key to enter morse code
    $(document).keydown(function(e) {
        if (e.which === 32 && !spaceDown && !submit) { // Check if the pressed key is the space key
            e.preventDefault();
            spaceDownTime = Date.now();
            displayDuration();
            $('#duration-display').text('0 seconds');
            spaceDown = true;
            playAudio();

            // turn on flashlight
            $('.flashlight-container').empty();
            $('.flashlight-container').append('<img class="flashlight" src="/static/image/led on.png">')
          } 
          else if (e.which === 8 && !submit) { // Check if the pressed key is the backspace key
            // Remove the last character from input-morse-code
            let text = $('.input-morse-code').text();
            $('.input-morse-code').text(text.slice(0, -1));
            if (text.length === 1 && !$('#submitAnswer').hasClass('hide')) {
                $('#submitAnswer').addClass('hide');
            }
            $('.morse-on-image img:last').remove();
        }
    });

    // release space key to stop entering morse code
    $(document).keyup(function(e) {
        if (e.which === 32 && spaceDown) {
            spaceDown = false;
            // reset the duration display
            clearInterval(audioTimer);
            morseAudio.pause();
            spaceDownTime = 0;

            // turn off flashlight
            $('.flashlight-container').empty();
            $('.flashlight-container').append('<img class="flashlight" src="/static/image/led off.png">')
          }
    });

    // determine dot or dash based on the duration of space key press
    function displayDuration() {
        let isError = false;
        intervalId = setInterval(function() {
            if (spaceDown) { // the user is holding the space bar -> keep update the duration of space key press
              duration = Date.now() - spaceDownTime;
              $('#duration-display').text(duration/1000 + ' seconds');
            } 
            else { // space key is released -> the user finished entering the morse code
                // determine dot or dash based on the duration of space key press
                $('.error').remove();
                if (duration < 200) { // dot
                    // console.log("dot duration: " + duration);
                    
                    // Append the dot to the input-morse-code to show on the screen
                    let input = '.';
                    $('.input-morse-code').append(input);
                    
                    // Append the dot image to the morse-on-image div
                    let morseImg = $('<img>').attr('src', '/static/image/dot.png').attr('alt', 'dot').attr('id', 'morse-img-' + morseImgId).addClass('morse-on-image');
                    morseImg.css({
                        'width': '40px',
                        'position': 'absolute',
                        'top': learn["position"][morseImgId][0] + 'px',
                        'left': learn["position"][morseImgId][1] + 'px'
                    })
                    $('.try-letter-container').append(morseImg)

                    
                    checkMorseCode(input);

                } 
                else if (duration > 200 && duration < 500) { // dash
                    console.log("dash duration: " + duration);

                    // Append the dash to the input-morse-code
                    let input = '-';
                    $('.input-morse-code').append(input);

                    let morseImg = $('<img>')
                    if (Array.isArray(learn["dash"])) {
                        console.log(learn["dash"][morseImgId])
                        morseImg.attr('src', learn["dash"][morseImgId]).attr('alt', 'dash').attr('id', 'morse-img-' + morseImgId).addClass('morse-on-image');
                        morseImg.css({
                            'width': learn["dash_width"] +'px',
                            'position': 'absolute',
                            'top': learn["position"][morseImgId][0] + 'px',
                            'left': learn["position"][morseImgId][1] + 'px'
                        })
                    } else {
                        morseImg.attr('src', learn["dash"]).attr('alt', 'dash').attr('id', 'morse-img-' + morseImgId).addClass('morse-on-image');
                        morseImg.css({
                            'width': learn["dash_width"] +'px',
                            'position': 'absolute',
                            'top': learn["position"][morseImgId][0] + 'px',
                            'left': learn["position"][morseImgId][1] + 'px'
                        })
    
                    }


                    $('.try-letter-container').append(morseImg)


                    checkMorseCode(input);

                } 
                else { // invalid input
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

    // play morse code audio
    function playAudio() {
        morseAudio.currentTime = 0; // Reset audio to the beginning
        morseAudio.play();
        // Set a timeout to stop audio playback after 500 milliseconds
        // the longest duration for a dash is 500 milliseconds
        audioTimer = setTimeout(function() {
            morseAudio.pause();
        }, 500);
    }

    // check if the entered morse code is correct (one code at a time)
    function checkMorseCode(input) {
        if (input !== learn["morse_code"][morseImgId]) {
            submit = true;
            isCorrect = false;
            let feedback = $("<div class='feedback'>").html("Try again!").addClass("quiz-wrong");
            let continueMessage = $("<div class='continue-message'>").html("Click anywhere to continue");
            $('#answer-feedback-container').append(feedback, continueMessage);
        }
        // move to the next morse code
        morseImgId++;

        // check if the user has entered all morse code for the letter
        if (morseImgId == learn["morse_code"].length) {
            submit = true;
            if (isCorrect) {
                // add feedback messages when answer is correct
                let feedback = $("<div class='feedback'>").html("Correct!").addClass("quiz-correct");
                let continueMessage = $("<div class='continue-message'>").html("Click anywhere to continue");
                $('#answer-feedback-container').append(feedback, continueMessage);
            }
        }
    }
    $('#practice-again-btn').click(function () {
        // Reset variables and UI elements
        $('.input-morse-code').empty();
        $('#answer-feedback-container').empty();
        submitted = false;
        isCorrect = false;

    });

    // click to continue to next page
    $(document).click(function() {
        console.log("click")
        if (submit) {
            if (isCorrect) { 
                // move to the next letter
                let nextLearn = learn["id"] + 1
                if (nextLearn > total_letters) {
                    window.location.href = "/finish_learn";
                } else {
                    window.location.href = "/learn/" + nextLearn;
                }
            } 
            else {
                // reset the page
                $('#answer-feedback-container').empty();
                $('.input-morse-code').empty();
                $('.morse-on-image').remove();
                submit = false;
                isCorrect = true;
                morseImgId = 0;
            }
        }
    })
});