/**
 * Created with JetBrains WebStorm.
 * User: ciictech
 * Date: 12-9-24
 * Time: 上午11:29
 * To change this template use File | Settings | File Templates.
 */
/**
 * css3 translate flip
 * -webkit-box
 * @author: danny
 */

(function (win, undefined) {

    var initializing = false;
       superTest = /horizon/.test(function () {horizon;}) ? /\b_super\b/ : /.*/;
    this.Class = function () {};

    Class.extend = function (prop) {
        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;

        for (var name in prop) {               // Check if we're overwriting an existing function
            prototype[name] = (typeof prop[name] === 'function' && typeof _super[name] === 'function' && superTest.test(prop[name])) ? (function (name, fn) {
                return function () {
                    var temp = this._super; // Add a new ._super() method that is the same method but on the super-class
                    this._super = _super[name]; // The method only need to be bound temporarily, so we remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = temp;

                    return ret;
                }
            })(name, prop[name]) : prop[name];
        }

        function Class () {
            if (!initializing && this.init) {
                this.init.apply(this, arguments);
            }// Populate our constructed prototype object
        }
        Class.prototype = prototype; // Enforce the constructor to be what we expect
        Class.constructor = Class;
        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };

    var $support = {
        transform3d: ('WebKitCSSMatrix' in win),  //translate(x,y)定义基于x、y的2D平移; translate3d(x,y,z) 定义基于x、y、z的3D平移;
        touch: ('ontouchstart' in win)
    };

    var $E = {
        start: $support.touch ? 'touchstart' : 'mousedown',
        move: $support.touch ? 'touchmove' : 'mousemove',
        end: $support.touch ? 'touchend' : 'mouseup',
        onlyend: $support.touch ? 'touchend' : 'mouseup'
    };

    var autoplay =false;
    var autoplayTimer = 3000;

    var down = true;

    function getTranslate (x) {
        return $support.transform3d ? 'translate3d('+x+'px, 0, 0)' : 'translate('+x+'px, 0)';
    }
    function getPage (event, page) {
        return $support.touch ? event.changedTouches[0][page] : event[page];
    }

    var Css3Flip = Class.extend({
        init: function (selector, conf) {
            var self = this;

            if (selector.nodeType && selector.nodeType == 1) {
                self.element = selector;
            } else if (typeof selector == 'string') {
                self.element = document.getElementById(selector) || document.querySelector(selector);
            }

            self.element.style.display = '-webkit-box';
            self.element.style.webkitTransitionProperty = '-webkit-transform';
            self.element.style.webkitTransitionTimingFunction = 'cubic-bezier(0,0,0.25,1)';
            self.element.style.webkitTransitionDuration = '0';
            self.element.style.webkitTransform = getTranslate(0);

            self.conf = conf || {};
            self.touchEnabled = true;
            self.currentPoint = 0;
            self.currentX = 0;

            self.refresh();

            // 支持handleEvent
            self.element.addEventListener($E.start, self, false);
            self.element.addEventListener($E.move, self, false);
            document.getElementById("doc").addEventListener($E.end,self,false);
            document.getElementById("autoplay").addEventListener($E.end,function() {
                autoplay = true;
                win.setTimeout(function(){
                    if(autoplay) self.timeJump()
                },autoplayTimer);
            },false);

            $("#autoplay").css({
                "-webkit-transform":"scale(1)",
                "transform":"scale(1)"
            });

            win.setTimeout(function(){
                if(autoplay) self.timeJump()
            },autoplayTimer);
            return self;

        },
        handleEvent: function(event) {
            var self = this;

            switch (event.type) {
                case $E.start:
                    self._touchStart(event);
                    break;
                case $E.move:
                    self._touchMove(event);
                    break;
                case $E.end:
                    self._touchEnd(event);
                    break;
                case 'click':
                    self._click(event);
                    break;
            }
        },
        refresh: function() {                               //get the number of section (picture)
            var self = this;

            var conf = self.conf;

            // setting max point
            self.maxPoint = conf.point || (function() {          //the number of section (picture)
                var childNodes = self.element.childNodes,
                    itemLength = 0,
                    i = 0,
                    len = childNodes.length,
                    node;
                for(; i < len; i++) {
                    node = childNodes[i];
                    if (node.nodeType === 1) {
                        itemLength++;
                    }
                }
                if (itemLength > 0) {
                    itemLength--;
                }

                return itemLength;
            })();

            // setting distance
            self.distance = conf.distance || self.element.scrollWidth / (self.maxPoint + 1);       //scrollWidth 内容实际宽度; distance 相当于一张图片所占宽度

            // setting maxX
            self.maxX = conf.maxX ? - conf.maxX : - self.distance * self.maxPoint;

            self.moveToPoint(self.currentPoint);

        },
        hasNext: function() {                          //returen ture or false
            var self = this;

            return self.currentPoint < self.maxPoint;
        },
        hasPrev: function() {
            var self = this;

            return self.currentPoint > 0;
        },
        toNext: function() {
            var self = this;

            if (!self.hasNext()) {
                return;
            }

            self.moveToPoint(self.currentPoint + 1);
        },
        toPrev: function() {
            var self = this;

            if (!self.hasPrev()) {
                return;
            }

            self.moveToPoint(self.currentPoint - 1);
        },
        moveToPoint: function(point) {
            var self = this;

            self.currentPoint =
                (point < 0) ? 0 :
                    (point > self.maxPoint) ? self.maxPoint :
                        parseInt(point);


            self.element.style.webkitTransitionDuration = '500ms';
            self._setX(- self.currentPoint * self.distance)       //pay attention on the minus~~~~

            setScrollImgLinkAge(data[self.currentPoint].id, self.currentPoint);     //小图随动
            var ev = document.createEvent('Event');              //?????????????
            ev.initEvent('css3flip.moveend', true, false);
            self.element.dispatchEvent(ev);
        },
        _setX: function(x) {
            var self = this;
            self.currentX = x;
            self.element.style.webkitTransform = getTranslate(x);
        },
        _touchStart: function(event) {                  //touchstart
            var self = this;
            if (!self.touchEnabled) {
                return;
            }

            if (!$support.touch) {
                event.preventDefault();
            }

            self.element.style.webkitTransitionDuration = '0';
            self.scrolling = false;                        //after touching, we can scroll 判断是滑动的touchend还是单击的touchend
            self.moveReady = false;
            self.startPageX = getPage(event, 'pageX');  //当前手触位置的x
            self.startPageY = getPage(event, 'pageY');
            self.basePageX = self.startPageX;         //note the x when touchstart
            self.directionX = 0;
            self.startTime = event.timeStamp;
            self.deltaX = 0;
        },
        _touchMove: function(event) {                     //touchmove
            autoplay=false;
            var self = this;

            var pageX = getPage(event, 'pageX'),
                pageY = getPage(event, 'pageY'),
                distX,
                newX,
                //deltaX,
                deltaY;

       //     self.scrolling = false;
            if (self.moveReady) {
                event.preventDefault();
                event.stopPropagation();

                distX = pageX - self.basePageX;                   //current x - touchstart x
                newX = self.currentX + distX;
                if (newX >= 0 || newX < self.maxX) {                        //最后一张图和第一张图的时候
                    newX = Math.round(self.currentX + distX /3);
                }
                self._setX(newX);
                self.directionX = distX > 0 ? -1 : 1;
        //        self.scrolling = true;
            }
            else {
                self.deltaX = Math.abs(pageX - self.startPageX);
                deltaY = Math.abs(pageY - self.startPageY);

                if (self.deltaX > 5) {
                    event.preventDefault();
                    event.stopPropagation();
                    self.moveReady = true;
                    self.element.addEventListener('click', self, true);
                //}
                //else if (deltaY > 5) {
                    //self.scrolling = false;
                    self.scrolling = true;
                }
            }

            self.basePageX = pageX;
        },
        _touchEnd: function(event) {
            var self = this;
            if (!self.scrolling) {                                          //false时进来
                self.scrolling = true;
                if(down)
            {

//                $("#down").css({
//                    "-moz-transition": "all 0.5s ease-out",
//                    "-webkit-transition": "all 0.5s ease-out",
//                    "-o-transition": "all 0.5s ease-out",
//                    "transition": "all 0.5s ease-out" ,
//                    "-webkit-transform":"translate(0px,-300px)"
//                });
                $("#up").css({
                    "-moz-transition": "all 0.5s ease-out",
                    "-webkit-transition": "all 0.5s ease-out",
                    "-o-transition": "all 0.5s ease-out",
                    "transition": "all 0.5s ease-out" ,
                    "-webkit-transform":"translate(0px,0px)"
                });
                down = false;
            }
            else{
//                $("#down").css({
//                    "-moz-transition": "all 0.5s ease-out",
//                    "-webkit-transition": "all 0.5s ease-out",
//                    "-o-transition": "all 0.5s ease-out",
//                    "transition": "all 0.5s ease-out" ,
//                    "-webkit-transform":"translate(0px,0px)"
//                });
                    $("#up").css({
                        "-moz-transition": "all 0.5s ease-out",
                        "-webkit-transition": "all 0.5s ease-out",
                        "-o-transition": "all 0.5s ease-out",
                        "transition": "all 0.5s ease-out" ,
                        "-webkit-transform":"translate(0px,-150px)"
                    });
                down = true;
            }

                return;
            }
            //self.scrolling = false;
         var newPoint = -self.currentX / self.distance;
            if(self.directionX>0){
              //  if( Math.abs(getPage(event, 'pageX')-self.basePageX) > 0){
                if(self.deltaX > 7){
            newPoint = Math.ceil(newPoint);
              //  (self.directionX > 0) ? Math.ceil(newPoint) :                //向下取整
             //       (self.directionX < 0) ? Math.floor(newPoint) :            //向上取整
             //           Math.round(newPoint);
            self.moveToPoint(newPoint);
            }
            else{
                newPoint = Math.floor(newPoint);
            self.moveToPoint(newPoint);
            }
            }
            else if(self.directionX<0){
                if(self.deltaX > 7)
                {
                    newPoint =  Math.floor(newPoint);
                    self.moveToPoint(newPoint);
                }
                else{
                    newPoint = Math.ceil(newPoint);
                    self.moveToPoint(newPoint);
                }

            }
            setTimeout(function() {
                self.element.removeEventListener('click', self, true);
            }, 200);
        },
        _click: function(event) {
            var self = this;
            event.stopPropagation();
            event.preventDefault();
        },
        timeJump: function() {
//            if(autoplay){
//            var self=this;
//            self.scrolling = true;
//            if (self.currentPoint == self.maxPoint) {
//                self.currentPoint=0;//iscGlobal.current = 0;
//                var total_length = self.element.scrollWidth;// (iscGlobal.cObj.width() * iscGlobal.imagesLength) - iscGlobal.cObj.width();
//                self.moveToPoint(0);
//            } else {
//                self.toNext();
//            }
//            }
//            if (autoplay) {                                      //实现多次调用
//                win.setTimeout(function(){
//                  self.timeJump()
//                },3000);
//            }
//            history.back();
        },
        destroy: function() {
            var self = this;

            self.element.removeEventListener(touchStartEvent, self);
            self.element.removeEventListener(touchMoveEvent, self);
            document.removeEventListener(touchEndEvent, self);
        }


    });

    this.Css3Flip = function (selector, conf) {
        return (this instanceof Css3Flip) ? this.init(selector, conf) : new Css3Flip(selector, conf);
    }

})(window);
