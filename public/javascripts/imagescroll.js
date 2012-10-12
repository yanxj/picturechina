$(document).ready(function () {
    var pages = $('#overflow_top   .inner_top');
    pages.css('-webkit-transform-style','preserve-3d');
    pages.currentIndex = 0;
    pages.pagewidth = $('#overflow_top').width();


    var moveX = 0;
    $('#overflow_top').on(
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

                //滑动超过屏幕三分之一或者两次move的距离大于2就产生滑动效果，否则就是点击
                if (Math.abs(pages.moveX) >  pages.pagewidth  / 3 || Math.abs(pages.velocity) > 2) {


                    if (pages.moveX < 0) {
                        if(pages.pagewidth * (pages.currentIndex+1)<pages.get(0).scrollWidth)//pages.get(0).scrollWidth；pages.width()
                        {
                            pages.currentIndex++;
                        }
                    } else {
                        if (pages.currentIndex > 0) {
                            pages.currentIndex--;
                        }
                    }


                    $("#page_top label").each(function(index) {

                        if(index==pages.currentIndex){
                            $(this).addClass("highlight").removeClass('nohighlight');;
                        }else{
                            $(this).addClass("nohighlight").removeClass('highlight');;
                        }
                        //alert(index + ': ' +pages.currentIndex+":"+ $(this).attr("class"));

                    });




                }else{
console.log($(e.target).attr("index"));
                    var index = $(e.target).attr("index").valueOf();
                    console.log(articlelist[index]);

                    location.href="../pictureChina.html?imgsurl="+articlelist[index].url;
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