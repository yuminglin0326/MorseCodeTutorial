$(document).ready(function() {
    let spaceDownTime = 0;
    let spaceDown = false;
    let duration = 0;
    let morseAudio = new Audio('/static/morse_code_T.mp3');

    $(document).keydown(function(e) {
        if (e.which === 32 && !spaceDown) { 
            spaceDownTime = Date.now();
            displayDuration();
            $('#durationDisplay').text('0 seconds');
            spaceDown = true;
            playAudio();
          }
    });

    $(document).keyup(function(e) {
        if (e.which === 32 && spaceDown) {
            spaceDown = false;
            clearInterval(audioTimer);
            morseAudio.pause();
            spaceDownTime = 0;
          }
    });

    function displayDuration() {
        let isError = false;
        intervalId = setInterval(function() {
            if (spaceDown) {
              duration = Date.now() - spaceDownTime;
              $('#durationDisplay').text(duration/1000 + ' seconds');
            } else {
                $('.error').remove();
                if (duration < 200) {
                    console.log("dot duration: " + duration);
                    $('.inputMorseCode').append('.');
                } else if (duration > 200 && duration < 500) {
                    console.log("dash duration: " + duration);
                    $('.inputMorseCode').append('-');
                } else {
                    let error = $("<div class='error'>")
                    error.html("try enter the morse code again!")
                    if (!isError) {
                        isError = true;
                        $('.inputMorseCode').after(error);
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
        let answer = $('.inputMorseCode').text();
        if (answer === quiz["answer"]) {
            console.log("Correct!");
        } else {
            console.log("Incorrect!");
        }
    });

    
});