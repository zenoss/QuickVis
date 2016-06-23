/* jshint esnext: true */
(function(){
    "use strict";

    function rand(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function randVals(min, max, count=1){
        let a = [];
        for(let i = 0; i < count; i++){
            a.push(rand(min,max));
        }
        return a;
    }

    let contentEl = document.querySelector(".content");

    var sparky = new quickVis.Sparkline({
        metric:"RAM",
        threshold: 75
    });
    sparky.render(randVals(50,150,20));
    contentEl.appendChild(sparky.el);

    var bars = new quickVis.StackedBar({
        name: "Some Exciting Bars",
        capacity: 200
    });
    bars.render([
        { name: "series 1", val: rand(10, 40)},
        { name: "your mom", val: rand(30, 80)},
        { name: "my mom", val: rand(30, 80)},
        { name: "another mom", val: rand(30, 80)},
    ]);
    contentEl.appendChild(bars.el);

})();
