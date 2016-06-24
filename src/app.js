/* jshint esnext: true */
(function(){
    "use strict";

    function rand(min, max, floor){
        let val = (Math.random() * (max - min)) + min;
        return floor ? Math.floor(val) : val;
    }
    function randVals(min, max, count=1){
        let a = [];
        for(let i = 0; i < count; i++){
            a.push(rand(min,max));
        }
        return a;
    }

    function trendyRandVals(min, max, count=1){
        let vals = [rand(min,max)],
            violence = 0.2,
            dirRange = ((max - min) / count) * 2,
            dir = rand(-dirRange,dirRange);

        for(let i = 0; i < count; i++){
            if(rand(0,1) >= violence){
                dir = rand(-10,10);
            }
            vals.push(rand(vals[i], vals[i]+dir));
        }
        return vals;
    }

    let contentEl = document.querySelector(".content");

    for(let i = 0; i < 10; i++){
        let vals = trendyRandVals(0, 10000, 20);
        let sparky = new quickVis.Sparkline({
            metric:"RAM",
            threshold: vals[rand(0, vals.length-1, true)],
            unit: "B"
        });
        contentEl.appendChild(sparky.el);
        sparky.render(vals);
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
