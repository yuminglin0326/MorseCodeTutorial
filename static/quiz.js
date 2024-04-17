$(document).ready(function() {
    let spaceDownTime = 0;
    let spaceDown = false;
    let duration = 0;

    $(document).keydown(function(e) {
        if (e.which === 32 && !spaceDown) { 
            spaceDownTime = Date.now();
            displayDuration();
            $('#durationDisplay').text('0 seconds');
            spaceDown = true;
          }
    });

    $(document).keyup(function(e) {
        if (e.which === 32 && spaceDown) {
            spaceDown = false;
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

    $('#submitAnswer').click(function() {
        let answer = $('.inputAnswer').text();
        if (answer === quiz["answer"]) {
            console.log("Correct!");
        } else {
            console.log("Incorrect!");
        }
    });

    
});