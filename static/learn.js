$(document).ready(function() {
    let displayed = false; // check if the letter is displayed
    $(document).click(function() {
        // Hide the div with id 'click-msg'
        $('#click-msg').hide();

        if (displayed) {
            console.log("clicked")
            return;
        }

        // display morse code on the letter
        for (let i = 0; i < learn["morse_code"].length; i++) {
            if (learn["morse_code"][i] == '.') {
                let morseImg = $('<img>').attr('src', '/static/image/dot.png').attr('alt', learn["morse_code"][i]).attr('id', 'morse-img-' + i);
                morseImg.css({
                    'width': '35px',
                    'position': 'absolute',
                    'top': learn["position"][i][0] + 'px',
                    'left': learn["position"][i][1] + 'px'
                })
                $('.try-letter-container').append(morseImg);
            } else {
                let morseImg = $('<img>')
                if (Array.isArray(learn["dash"])) {
                    console.log(learn["dash"][i])
                    morseImg.attr('src', learn["dash"][i]).attr('alt', learn["morse_code"][i]).attr('id', 'morse-img-' + i);
                    morseImg.css({
                        'width': '185px',
                        'position': 'absolute',
                        'top': learn["position"][i][0] + 'px',
                        'left': learn["position"][i][1] + 'px'
                    })
                } else {
                    morseImg.attr('src', learn["dash"]).attr('alt', learn["morse_code"][i]).attr('id', 'morse-img-' + i);
                    morseImg.css({
                        'width': '110px',
                        'position': 'absolute',
                        'top': learn["position"][i][0] + 'px',
                        'left': learn["position"][i][1] + 'px'
                    })
                }
                
                $('.try-letter-container').append(morseImg);
            }
        }

        $('.learn-message').html('The order matters!');

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
        for (let i = 0; i < learn["flash_interval"].length; i++) {
            let interval = learn["flash_interval"][i];
            if (i % 2 == 0) {
                setTimeout(function() {
                    console.log(interval)
                    $('.flashlight-on').hide();
                    $('.flashlight-off').show();
                    
                }, interval);
            } else {
                setTimeout(function() {
                    console.log(interval)
                    $('.flashlight-off').hide();
                    $('.flashlight-on').show();
                    
                }, interval);
            }
        }
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