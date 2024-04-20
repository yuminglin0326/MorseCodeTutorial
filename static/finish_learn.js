$(document).ready(function() {
    console.log(learns)
    $('#learn-quiz-button').click(function() {
        window.location.href = "/quiz";
    });

    $('#learn-review-button').click(function() {
        $(".review-detail-button").empty();
        $.each(learns, function(index, learn) {
            let id = learn["id"];
            let letter = learn["letter"];
            let newButton = $("<button>").html(letter.toUpperCase()).addClass("btn btn-light letter").attr("data-id", id);
            newButton.click(function() {
                window.location.href = "/learn/" + id;
            });
            $(".review-detail-button").append(newButton);
        })
    });
});