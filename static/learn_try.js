$(document).ready(function() {
    let spaceDownTime = 0;
    let spaceDown = false;
    let duration = 0;
    let morseAudio = new Audio('/static/audio/morse_code_T.mp3');
    let morseImgId = 0;
    let submit = false
    let isCorrect = true;

    $(document).keydown(function(e) {
        if (e.which === 32 && !spaceDown && !submit) { // Check if the pressed key is the space key
            spaceDownTime = Date.now();
            displayDuration();
            $('#duration-display').text('0 seconds');
            spaceDown = true;
            playAudio();

            // turn on flashlight
            $('.flashlight-container').empty();
            $('.flashlight-container').append('<img class="flashlight" src="/static/image/led on.png">')
          } else if (e.which === 8 && !submit) { // Check if the pressed key is the backspace key
            // Remove the last character from input-morse-code
            let text = $('.input-morse-code').text();
            $('.input-morse-code').text(text.slice(0, -1));
            if (text.length === 1 && !$('#submitAnswer').hasClass('hide')) {
                $('#submitAnswer').addClass('hide');
            }
            $('.morse-on-image img:last').remove();
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
                    
                    let input = '.';
                    // Append the dot to the input-morse-code
                    $('.input-morse-code').append(input);
                    
                    // Append the dot image to the morse-on-image div
                    let morseImg = $('<img>').attr('src', '/static/image/dot.png').attr('alt', 'dot').attr('id', 'morse-img-' + morseImgId);
                    morseImg.css({
                        'width': '60px',
                        'position': 'absolute',
                        'top': learn["position"][morseImgId][0] + 'px',
                        'left': learn["position"][morseImgId][1] + 'px'
                    })
                    $('.morse-on-image').append(morseImg)

                    
                    checkMorseCode(input);

                } else if (duration > 200 && duration < 500) {
                    console.log("dash duration: " + duration);

                    let input = '-';
                    // Append the dash to the input-morse-code
                    $('.input-morse-code').append(input);

                    // Append the dash image to the morse-on-image div
                    let morseImg = $('<img>').attr('src', learn["dash"]).attr('alt', 'horizontal dash').attr('id', 'morse-img-' + morseImgId);
                    morseImg.css({
                        'width': '110px',
                        'position': 'absolute',
                        'top': learn["position"][morseImgId][0] + 'px',
                        'left': learn["position"][morseImgId][1] + 'px'
                    })
                    $('.morse-on-image').append(morseImg)


                    checkMorseCode(input);

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

    function checkMorseCode(input) {
        if (input !== learn["morse_code"][morseImgId]) {
            console.log(".wrong morse code");
            submit = true;
            isCorrect = false;
            let feedback = $("<div class='feedback'>").html("Try again!").addClass("quiz-wrong");
            let continueMessage = $("<div class='continue-message'>").html("Click anywhere to continue");
            $('#answer-feedback-container').append(feedback, continueMessage);
        }
        morseImgId++;

        if (morseImgId >= learn["morse_code"].length) {
            submit = true;
            if (isCorrect) {
                // add feedback messages when answer is correct
                let feedback = $("<div class='feedback'>").html("Correct!").addClass("quiz-correct");
                let continueMessage = $("<div class='continue-message'>").html("Click anywhere to continue");
                $('#answer-feedback-container').append(feedback, continueMessage);
            }
        }
    }

    $(document).click(function() {
        console.log("click")
        if (submit) {
            if (isCorrect) {
                let nextLearn = learn["id"] + 1
                if (nextLearn > total_letters) {
                    window.location.href = "/finish_learn";
                } else {
                    window.location.href = "/learn/" + nextLearn;
                }
            } else {
                $('#answer-feedback-container').empty();
                $('.input-morse-code').empty();
                $('.morse-on-image').empty();
                submit = false;
                isCorrect = true;
                morseImgId = 0;
            }
        }
    })
});