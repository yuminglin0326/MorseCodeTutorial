$(document).ready(function() {
    let spaceDownTime = 0; // keep track of the time when the space key is pressed
    let spaceDown = false; // keep track of whether if the user is holding the space key
    let duration = 0; // keep track of the duration of space key press
    let morseAudio = new Audio('/static/audio/t-audio.mp3'); // morse code audio
    let morseImgId = 0; // keep track of index of the morse code being entered
    let submit = false // keep track of whether the user has submitted the answer
    let isCorrect = true; // keep track of whether the user has entered the correct morse code
    let correctCount = 0;
    let mode = "letter"; // all modes: letter, audio, flashlight
    let sideFlashlight = true;

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
            if (sideFlashlight) {
                $('.flashlight-container').empty();
                $('.flashlight-container').append('<img class="flashlight" src="/static/image/led on.png">')
            }
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
            if (sideFlashlight) {
                $('.flashlight-container').empty();
                $('.flashlight-container').append('<img class="flashlight" src="/static/image/led off.png">')
            }
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
                if (duration < 350) { // dot
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
                else if (duration > 350 && duration < 800) { // dash
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
                    error.html("Pressed for too long. try enter the morse code again!")
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
        if (submit) {
            if (isCorrect) {
                correctCount++;
                if (mode == "letter" && correctCount == 1) {
                    correctCount = 0;
                    // switch to audio mode
                    mode = "audio";
                    $(".learn-container").empty();
                    resetPage();
                    displayAudioMode();
                }
                else if (mode == "audio" && correctCount == 1) {
                    correctCount = 0;
                    // switch to flashlight mode
                    mode = "flashlight";
                    sideFlashlight = false;
                    $(".learn-container").empty();
                    $(".flashlight-container").empty();
                    resetPage();
                    displayFlashlightMode();
                }
                else if (mode == "flashlight" && correctCount == 1){
                    correctCount = 0;
                    // move to the next letter
                    let nextLearn = learn["id"] + 1
                    if (nextLearn > total_letters-1) {
                        window.location.href = "/finish_learn";
                    } else {
                        window.location.href = "/learn/" + nextLearn;
                    }
                }
                else {
                    resetPage();
                }
            } 
            else {
                // reset the page
                resetPage();
            }
        }
    });

    // reset the page
    function resetPage() {
        $('#answer-feedback-container').empty();
        $('.input-morse-code').empty();
        $('.morse-on-image').remove();
        submit = false;
        isCorrect = true;
        morseImgId = 0;
    }

    // display audio mode
    function displayAudioMode() {
        let audioFilePath = learn["morse_audio"];
        let audioPlayer = $("<div class='quiz-audio'>");
        audioImg = $("<img src='/static/image/audio-off.png' alt='audio'>");
        audioPlayer.append(audioImg);
        $('.learn-container').append(audioPlayer);
        console.log("morse audio to English");

        // play audio when user clicks on the audio image
        $('.quiz-audio').click(function() {
            console.log(audioFilePath)
            let letterAudio = new Audio(audioFilePath);
            letterAudio.play();
            audioPlayer.empty();
            audioImg = $("<img src='/static/image/audio-on.png' alt='audio'>");
            audioPlayer.append(audioImg);
            $(letterAudio).on('ended', function() {
                // Audio playback has ended
                console.log('Audio playback finished.');
                audioPlayer.empty();
                audioImg = $("<img src='/static/image/audio-off.png' alt='audio'>");
                audioPlayer.append(audioImg);
                // Add your desired functionality here
            });
        });
    }

    // display flashlight mode
    function displayFlashlightMode() {
        // display flashlight
        let flashlightContainer = $("<div class='flashlight-container-top text-center'>");
        let flashlightOff = $("<img class='flashlight-off hide' src='/static/image/led off.png' alt='led light off'>")
        let flashlightOn = $("<img class='flashlight-on hide' src='/static/image/led on.png' alt='led light on'>")
        flashlightContainer.append(flashlightOff, flashlightOn);
        $('.learn-container').append(flashlightContainer);
        playFlashlight(learn["flash_interval"]);

        $('.flashlight-container-top').click(function() {
            console.log("replay flashlight");
            playFlashlight(learn["flash_interval"]);
        });
    }

    function playFlashlight(intervals) {
        $('.flashlight-off').hide();
        $('.flashlight-on').show();
        console.log("flashlight on");
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
});