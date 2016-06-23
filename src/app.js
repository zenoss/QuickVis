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

    for(let i = 0; i < 10; i++){
        let sparky = new quickVis.Sparkline({
            metric:"RAM",
            threshold: rand(100, 125)
        });
        contentEl.appendChild(sparky.el);
        sparky.render(randVals(50,150,20));
    }

    var bars = new quickVis.StackedBar({
        name: "Some Exciting Bars",
        capacity: 200
    });
    contentEl.appendChild(bars.el);
    bars.render([
        { name: "series 1", val: rand(10, 40)},
        { name: "your mom", val: rand(30, 80)},
        { name: "my mom", val: rand(30, 80)},
        { name: "another mom", val: rand(30, 80)},
    ]);

})();
