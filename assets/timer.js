﻿/**
 * Created by aayaresko on 30.04.15.
 */

/**
 * Timer plugin.
 *
 * Отображает время, прошедшее со старта timer в формате ЧЧ:ММ:СС где:
 * 1. ЧЧ - кол-во прошедших с момента запуска часов;
 * 2. ММ - кол-во прошедших с момента запуска минут;
 * 2. CC - кол-во прошедших с момента запуска секунд;
 * Может быть запущен автоматически и вручную, может быть остановлен, сброшен
 *
 * Конфигурация plugin осуществляется через параметры:
 * 1. container - селектор html элемента, в котором необходимо отобразить таймер (по умолчанию '.timer');
 * 2. autoStart – запустить таймер сразу же после инициализации (по умолчанию - true);
 * 3. hours – начать счёт часов с этого значение (по умолчанию '00');
 * 4. minutes – начать счёт минут с этого значение (по умолчанию '00');
 * 5. seconds – начать счёт секунд с этого значение (по умолчанию '00');
 * 6. animate - анимировать таймер при запусе (мигание);
 * 7. animationSpeed - скорость анимации;
 * 8. animationTimes - количество повторений;
 *
 * Управление plugin осуществляется через методы:
 * 1. init(value) - инициализирует таймер, оформит html-содержимое container в виде таймера (если value == false) или запустит таймер автоматически (если value == true),
 * при этом, если таймер был ранее запущен автоматически остановит таймер и обнулит значения часов, минут, сукунд;
 * 2. go() - запустит таймер;
 * 3. stop(value) - остановит таймер сохранив текущие значение часов, минут, секунд (если value == false) или обнулит их (если value == true);
 * 4. flush() - сбросит таймер, обнулив значения часов, минут, секунд.
 *
 * @package yii2-widgets
 * @author aayaresko <aayaresko@gmail.com>
 */

(function( $ ) {
    $.fn.timer = function( options ){
        var plugin = {
            options: $.extend({
                'container': ".timer",
                'seconds': 0,
                'minutes': 0,
                'hours': 0,
                'milliseconds': 0,
                'animate': true,
                'animationSpeed': 200,
                'animationTimes': 3,
                'autoStart': true
            }, options),
            isRunning: false,
            getTimeAsString: function () {
                return plugin.formatDate();
            },
            getTimeAsSeconds: function () {
                return plugin.formatSeconds();
            },
            isTimerRunning: function () {
                return plugin.isRunning;
            },
            getTime: function () {
//                plugin.options.seconds += 1;
                plugin.options.milliseconds += 1;
                plugin.calculate();
                $(plugin.options.container).html( plugin.formatDate() );
            },
//            setTime: function ( seconds, minutes, hours ) {
                setTime: function ( milliseconds,seconds, minutes, hours ) {
                plugin.options.milliseconds = milliseconds;
                plugin.options.seconds = seconds;
                plugin.options.hours = hours;
                plugin.options.minutes = minutes;

                
            },
            flush: function (){
                plugin.setTime( 0, 0, 0, 0 );
                $(plugin.options.container).html( plugin.formatDate() );
                plugin.removeLocalStorage();
                console.log("Success! Timer flushed.");
            },
            formatDate: function (){
                var milliseconds = plugin.options.milliseconds,
                    seconds = plugin.options.seconds,
                    minutes = plugin.options.minutes,
                    hours = plugin.options.hours;
                if( plugin.options.hours < 10 ){
                    hours = "0" + plugin.options.hours;
                }
                if( plugin.options.minutes < 10 ){
                    minutes = "0" + plugin.options.minutes;
                }
                if( plugin.options.seconds < 10 ){
                    seconds = "0" + plugin.options.seconds;
                }
                if( plugin.options.milliseconds < 10 ){
                    milliseconds = "0" + plugin.options.milliseconds;
                }
                return hours + ":" + minutes + ":" + seconds + "," + milliseconds.toString().substr(0,2);
            },
            formatSeconds: function (){
                var seconds = plugin.options.seconds,
                    minutes = plugin.options.minutes,
                    hours = plugin.options.hours;
                var total = seconds + (60*minutes) + (3600*hours);
                return {'total': total, 
                        'milliseconds': plugin.options.milliseconds,
                        'seconds': plugin.options.seconds,
                        'minutes': plugin.options.minutes,
                        'hours': plugin.options.hours};
            },
            calculate: function () {
                var date = new Date(Date.now() - localStorage.getItem("starttime"));
                plugin.options.milliseconds = date.getMilliseconds();
                plugin.options.seconds = date.getSeconds();
                plugin.options.minutes = date.getMinutes();
                plugin.options.hours = date.getHours() - 1;
                if( plugin.options.milliseconds > 999 ) {
                    plugin.options.seconds += 1;
                    plugin.options.milliseconds = 0;
                }
                if( plugin.options.seconds > 59 ) {
                    plugin.options.minutes += 1;
                    plugin.options.seconds = 0;
                }
                if( plugin.options.minutes > 59 ) {
                    plugin.options.hours += 1;
                    plugin.options.minutes = 0;
                }
                if( plugin.options.hours > 59 ) {
                    plugin.options.hours = 0;
                }
                var dateformat = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "," + date.getMilliseconds();
                localStorage.setItem("difference", dateformat);
                localStorage.setItem("milliseconds", plugin.options.milliseconds);
                localStorage.setItem("seconds", plugin.options.seconds);
                localStorage.setItem("hours", plugin.options.hours);
                localStorage.setItem("minutes", plugin.options.minutes);
            },
            removeLocalStorage: function(){
                localStorage.removeItem("milliseconds");
                localStorage.removeItem("seconds");
                localStorage.removeItem("minutes");
                localStorage.removeItem("hours");
                localStorage.removeItem("starttime");
                localStorage.removeItem("difference");
            },
            init: function( autoStart ){
                if( plugin.isRunning ){
                    plugin.stop( true );
                } else {
                    $(plugin.options.container).html( plugin.formatDate() );
                }
                if( autoStart || plugin.options.autoStart ){
                    plugin.go();
                }
            },
            go: function( animate ){
                if( plugin.isRunning ){
                    console.log("Error! Plugin already running!")
                } else {
                    
                    if (localStorage.getItem("seconds")){
                      plugin.options.milliseconds = parseInt(localStorage.getItem("milliseconds"));
                      plugin.options.seconds = parseInt(localStorage.getItem("seconds"));
                      plugin.options.minutes = parseInt(localStorage.getItem("minutes"));
                      plugin.options.hours = parseInt(localStorage.getItem("hours"));
                      
                    } else {
                        localStorage.setItem("starttime", Date.now());
                    }
                    plugin.isRunning = true;
                    plugin.run();
//                    plugin.animate( 0 );
                    console.log("Success! Timer started.");
                }
            },
            stop: function( autoFlush ){
                if( autoFlush ) {
                    plugin.flush();
                } else {
                    plugin.isRunning = false;
                }
            },
            run: function(){
                setTimeout(function(){
                    if( plugin.isRunning ){
                        plugin.getTime();
                        plugin.run();
                    } else {
                        console.log("Success! Cycle interrupted.");
                    }
                }, 0.1);
            },
            animate: function( done ){
                if( $(plugin.options.container).css("opacity") < 1 ){
                    done += 1;
                    $(plugin.options.container).animate( {opacity:1}, plugin.options.animationSpeed );
                } else {
                    $(plugin.options.container).animate( {opacity:0.1}, plugin.options.animationSpeed );
                }
                setTimeout(function(){
                    if( done < plugin.options.animationTimes ) {
                        plugin.animate( done );
                    }
                }, plugin.options.animationSpeed);
            }
        };
        return {
            init: plugin.init,
            go: plugin.go,
            stop: plugin.stop,
            flush: plugin.flush,
            timeAsString: plugin.getTimeAsString,
            timeAsSeconds: plugin.getTimeAsSeconds,
            isRunning: plugin.isTimerRunning
        };
    };
})(jQuery);
