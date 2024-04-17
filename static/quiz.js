$(document).ready(function() {
    let spaceDownTime = 0;
    let spaceDown = false;
    let duration = 0;
    let morseAudio = new Audio('/static/morse_code_T.mp3');

    $(document).keydown(function(e) {
        if (e.which === 32 && !spaceDown) { 
            spaceDownTime = Date.now();
            displayDuration();
            $('#duration-display').text('0 seconds');
            spaceDown = true;
            playAudio();

            // turn on flashlight
            $('.flashlight-container').empty();
            $('.flashlight-container').append('<img class="flashlight" src="/static/led on.png">')
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
            $('.flashlight-container').append('<img class="flashlight" src="/static/led off.png">')
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

    $('#submitAnswer').click(function() {
        let answer = $('.input-morse-code').text();
        if (answer === quiz["answer"]) {
            console.log("Correct!");
            let inputAnswer = {
                "answer": answer,
                "is_correct": true
            }
            
            sendAnswer(inputAnswer);
        } else {
            console.log("Incorrect!");
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

    
});