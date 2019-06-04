(function () {
    'use strict';

    $('.lp-pant--btn').click(function () {
        $('.lp-pant--btn').removeClass('active');
        $(this).addClass('active');
    });

    $('#lp-pant--btn__detalhes').click(function () {
        $('#lp-pant--info__conhecendo').fadeOut(200, function () {
            $('#lp-pant--info__detalhes').fadeIn(200)
        })
    })

    $('#lp-pant--btn__conhecendo').click(function () {
        $('#lp-pant--info__detalhes').fadeOut(200, function () {
            $('#lp-pant--info__conhecendo').fadeIn(200)
        })
    })
})();