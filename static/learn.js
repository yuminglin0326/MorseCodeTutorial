$(document).ready(function() {
    let displayed = false;
    $(document).click(function() {
        if (displayed) {
            return;
        }
        // display the letter with morse code
        // $('#letter-plain').remove();
        $('.learn-message').html('The order matters!');
        // let morse_img = $('<img id="letter-morse" alt="letter-morse">');
        // console.log(learn["morse_image"]);
        // morse_img.attr('src', learn["morse_image"]);


        // display morse code on the letter
        for (let i = 0; i < learn["morse_code"].length; i++) {
            if (learn["morse_code"][i] == '.') {
                let morseImg = $('<img>').attr('src', '/static/image/dot.png').attr('alt', learn["morse_code"][i]).attr('id', 'morse-img-' + i);
                morseImg.css({
                    'width': '50px',
                    'position': 'absolute',
                    'top': learn["position"][i][0] + 'px',
                    'left': learn["position"][i][1] + 'px'
                })
                $('.try-letter-container').append(morseImg);
            } else {
                let morseImg = $('<img>').attr('src', learn["dash"]).attr('alt', learn["morse_code"][i]).attr('id', 'morse-img-' + i);
                morseImg.css({
                    'width': '110px',
                    'position': 'absolute',
                    'top': learn["position"][i][0] + 'px',
                    'left': learn["position"][i][1] + 'px'
                })
                $('.try-letter-container').append(morseImg);
            }
        }

        // $('.try-letter-container').append(learnMessage);

        // play the morse code audio
        let audio = new Audio(learn["morse_audio"]);
        audio.play();
        audio.currentTime = 0;

        // show the morse code
        let morseCode = $('<div class="input-morse-code">').text(learn["morse_code"]);
        $('.written-morse-container').append(morseCode);

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

        displayed = true;

    });

    // ToSolve: need to make dynamic
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