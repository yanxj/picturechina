$(document).ready(function () {
    var pages = $('#overflow');
    pages.css('-webkit-transform-style','preserve-3d');
    pages.currentIndex = 0;
    pages.pagewidth = $('body').width();


    var moveX = 0;
    $('#overflow').on(
        'touchstart touchmove touchend',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.type == 'touchstart') {
                pages.moveX = 0;
                pages.velocity = 0;
                pages.lastX = e.originalEvent.targetTouches[0].pageX;
                pages.touchId = e.originalEvent.targetTouches[0].identifier;
            }
            if (e.type == 'touchmove') {

                pages.velocity = e.originalEvent.targetTouches[0].pageX
                    - pages.lastX;
                pages.moveX += e.originalEvent.targetTouches[0].pageX
                    - pages.lastX;
                moveX += e.originalEvent.targetTouches[0].pageX
                    - pages.lastX;
                pages.css({
                    '-webkit-transform-style':'preserve-3d',
                    '-webkit-transform':'translate3d(' + moveX
                        + 'px,0px,0)'
                });
                pages.lastX = e.originalEvent.targetTouches[0].pageX;
            }
            if (e.type == 'touchend') {
                if (Math.abs(pages.moveX) >  pages.pagewidth  / 3 || Math.abs(pages.velocity) > 2) {


                    if (pages.moveX < 0) {
                        if(pages.pagewidth * (pages.currentIndex+1)<pages.width())//pages.get(0).scrollWidth；pages.width()
                        {
                            pages.currentIndex++;
                        }
                    } else {
                        if (pages.currentIndex > 0) {
                            pages.currentIndex--;
                        }
                    }


                    $("#page label").each(function(index) {

                        if(index==pages.currentIndex){
                            $(this).addClass("highlight").removeClass('nohighlight');;
                        }else{
                            $(this).addClass("nohighlight").removeClass('highlight');;
                        }
                        //alert(index + ': ' +pages.currentIndex+":"+ $(this).attr("class"));

                    });


                }
                else {
                    //alert($(e.target).html());
//                    if (pages.currentIndex > 0) {
//                        pages.currentIndex--;
//                    }
                }
                moveX =  pages.pagewidth  * -(pages.currentIndex);

                pages.css(
                    {
                        '-webkit-transform-style':'preserve-3d',
                        '-webkit-transform':'translate3d(' + moveX
                            + 'px,0px,0)',
                        '-webkit-transition-duration':'0.5s'
                    });
            }

        });
    pages.on('webkitTransitionEnd', function (e) {
        pages.css({
            '-webkit-transition-duration':'0s'
        });
    });
});