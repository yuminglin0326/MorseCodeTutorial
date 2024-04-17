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
          }
    });

    function displayDuration() {
        intervalId = setInterval(function() {
            if (spaceDown) {
              duration = Date.now() - spaceDownTime;
              $('#durationDisplay').text(duration/1000 + ' seconds');
            } else {
                
                if (duration < 200) {
                    console.log("dot duration: " + duration);
                    $('.inputAnswer').append('.');
                    $('.error').remove();
                } else if (duration > 300 && duration < 500) {
                    console.log("dash duration: " + duration);
                    $('.inputAnswer').append('-');
                    $('.error').remove();
                } else {
                    let error = $("<div class='error'>")
                    error.html("try enter the morse code again!")
                    $('.inputAnswer').append(error);
                }
                clearInterval(intervalId); 
            }
          }, 100);
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
        let answer = $('.inputAnswer').text();
        if (answer === quiz["answer"]) {
            console.log("Correct!");
        } else {
            console.log("Incorrect!");
        }
    });

    
});