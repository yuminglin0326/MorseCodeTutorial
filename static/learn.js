$(document).ready(function() {
    $('#letter-plain').click(function() {
        $('#letter-plain').remove();

        // display the letter with morse code
        let learnMessage = $('<p class="learn-message">The order matters!</p>');
        let morse_img = $('<img id="letter-morse" alt="letter-morse">');
        console.log(learn["morse_image"]);
        morse_img.attr('src', learn["morse_image"]);
        $('.learn-letter-container').append(learnMessage, morse_img);

        // play the morse code audio
        let audio = new Audio(learn["morse_audio"]);
        audio.play();
        audio.currentTime = 0;

        // show the morse code
        let morseCode = $('<div class="input-morse-code">').text(learn["morse_code"]);
        $('.learn-letter-container').append(morseCode);

        // display the flashlight
        let light_off = $('<img class="flashlight-off" alt="light-off">');
        light_off.attr('src', "/static/image/led off.png");
        let light_on = $('<img class="flashlight-on" alt="light-on">');
        light_on.attr('src', "/static/image/led on.png");

        // display buttons
        $('#learn-try-button').show();
        $('#learn-listen-button').show();
        
        // display the flashlight
        displayFlashlight();

    });

    displayFlashlight = function() {
        $('.flashlight-on').show();
        setTimeout(function() {
            $('.flashlight-on').hide();
            // Show img2 for 50ms
            $('.flashlight-off').show();
            setTimeout(function() {
                $('.flashlight-off').hide();
                // Show img1 for 600ms
                $('.flashlight-on').show();
                setTimeout(function() {
                    $('.flashlight-on').hide();
                    // Show img2 indefinitely
                    $('.flashlight-off').show();
                }, 600);
            }, 50);
        }, 300);
    }

    $('#learn-listen-button').click(function() {
        let audio = new Audio(learn["morse_audio"]);
        audio.play();
        audio.currentTime = 0;
        displayFlashlight();
    });

    $('#learn-try-button').click(function() {
        window.location.href = "/learn_try/" + learn["id"];
    });
});