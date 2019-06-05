document.addEventListener('DOMContentLoaded', function (){
    'use strict';

        $('.lp-pant--page-wrapper').fadeIn(400);

    $('.lp-pant--btn').click(function () {
        $('.lp-pant--btn').removeClass('active');
        $(this).addClass('active');
    });

    $('#lp-pant--btn__detalhes').click(function () {
        $('html, body').animate({
            scrollTop: $("#lp-pant--info__conhecendo").offset().top
        }, 800);

        $('#lp-pant--info__conhecendo').fadeOut(200, function () {
            $('#lp-pant--info__detalhes').fadeIn(200)
        })
    })

    $('#lp-pant--btn__conhecendo').click(function () {

        $('html, body').animate({
            scrollTop: $("#lp-pant--info__detalhes").offset().top
        }, 400);

        $('#lp-pant--info__detalhes').fadeOut(200, function () {
            $('#lp-pant--info__conhecendo').fadeIn(200);
        })
    })

    $('#lp-pant--scrolldown').click(function () {

        $('html, body').animate({
            scrollTop: $("#lp-pant--info").offset().top
        }, 600);
    })
});