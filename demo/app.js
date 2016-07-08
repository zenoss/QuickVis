(function(){
    "use strict";

    let {StackedBar, Sparkline} = quickvis;

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

        for(let i = 0; i < count-1; i++){
            if(rand(0,1) >= violence){
                dir = rand(-dirRange,dirRange);
            }
            vals.push(rand(vals[i], vals[i]+dir));
        }
        return vals;
    }

    let fullSparklineEl = document.createElement("div");
    fullSparklineEl.classList.add("content");
    fullSparklineEl.style.width = "250px";
    document.body.appendChild(fullSparklineEl);

    let types = ["line", "area", "bar", "scatter"];
    for(let i = 0; i < 5; i++){
        let vals = trendyRandVals(0, 10000, 15);
        let sparky = new Sparkline({
            metric:"RAM",
            threshold: vals[rand(0, vals.length-1, true)],
            unit: "B",
            style: types[rand(0,types.length,true)]
        });
        fullSparklineEl.appendChild(sparky.el);
        sparky.render(vals);
    }

    let compactSparklineEl = document.createElement("div");
    compactSparklineEl.classList.add("content");
    compactSparklineEl.style.width = "200px";
    document.body.appendChild(compactSparklineEl);

    for(let i = 0; i < 5; i++){
        let vals = trendyRandVals(0, 10000, 10);
        let sparky = new Sparkline({
            size: "compact",
            metric:"RAM",
            threshold: vals[rand(0, vals.length-1, true)],
            unit: "B",
            style: types[rand(0,types.length,true)]
        });
        compactSparklineEl.appendChild(sparky.el);
        sparky.render(vals);
    }

    let rowSparklineEl = document.createElement("div");
    rowSparklineEl.classList.add("content");
    rowSparklineEl.style.width = "200px";
    rowSparklineEl.style.lineHeight = "1.5em";
    document.body.appendChild(rowSparklineEl);

    for(let i = 0; i < 5; i++){
        let vals = trendyRandVals(0, 10000, 10);
        let sparky = new Sparkline({
            size: "row",
            metric:"RAM",
            threshold: vals[rand(0, vals.length-1, true)],
            unit: "B",
            style: "line"
        });
        rowSparklineEl.appendChild(sparky.el);
        sparky.render(vals);
    }

    let barEl = document.createElement("div");
    barEl.classList.add("content");
    barEl.style.width = "600px";
    document.body.appendChild(barEl);

    for(let i = 0; i < 3; i++){
        var bars = new StackedBar({
            name: "Some Exciting Bars",
            capacity: 200
        });
        barEl.appendChild(bars.el);
        bars.render([
            { name: "series 1", val: rand(10, 40)},
            { name: "your mom", val: rand(30, 80)},
            { name: "my mom", val: rand(30, 80)},
            { name: "another mom", val: rand(30, 80)},
        ]);
    }

})();
