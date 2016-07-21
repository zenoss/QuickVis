(function(){
    "use strict";

    let {StackedBar, Sparkline, SparklineGrid} = quickvis;

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

    // just like, make a sparkline and attach
    // to dom el with specified id
    function attachSparky(index, config, vals){
        let sparkyEl = document.querySelectorAll(".sparky")[index];
        let sparky = new Sparkline(config);
        sparkyEl.appendChild(sparky.el);
        sparky.render(vals);
    }

    let nightToggleEl = document.querySelector(".night-toggle");
    nightToggleEl.addEventListener("click", e => {
        document.body.classList.toggle("night"); 
    });

    let contentEl = document.querySelector(".content-wrap");

    // basic sparkline
    attachSparky(0, {
        metric: "Horses",
    }, [1, 4, 7, 18, 24, 98, 97, 90]);

    // more sparkline options
    attachSparky(1, {
        metric: "Narwhals",
        style: "area",
        unit: "❤",
        annotation: "out of 100"
    }, [1, 4, 7, 18, 24, 98, 97, 90]);

    // large numbers
    attachSparky(2, {
        metric: "Camels",
    },[916575094, 37473322, 783412004, 787777074, 957795371, 291285024, 847501582, 265160769, 71343712, 979961954]);

    // sparkline with threshold
    attachSparky(3, {
        metric: "Turtles",
        style: "line",
        threshold: 50
    }, [1, 4, 7, 18, 24, 98, 97, 90]);

    // sparkline with forced threshold
    attachSparky(4, {
        metric: "Ducks",
        style: "line",
        threshold: 50,
        forceThreshold: true
    }, [1, 4, 7, 18, 24, 20, 22, 23]);

    // styles
    ["line", "area", "bar", "scatter"].forEach(style => {
        attachSparky(5, {
            metric: style,
            style: style,
            threshold: 50
        }, [1, 4, 7, 18, 24, 95, 90, Math.random() * 100]);
    });

    // sparkline grids
    let sparklineGridEl = document.querySelector(".sparkline-grid");
    let grid = new SparklineGrid({
        sparklines: [{
            vals: [98,72,6,18,18,27,95,38,54,11],
            config: { metric: "Unicorns", unit: "" }
        },{
            vals: [2,7,99,77,14,10,23,21,16,2],
            config: { metric: "Pegasii", unit: "" }
        },{
            vals: [30,32,33,56,22,46,56,43,24,94],
            config: { metric: "Minotaurs", unit: "" }
        },{
            vals: [23,65,49,57,34,43,16,48,29,96],
            config: { metric: "Deepcrows", unit: "" }
        },{
            vals: [65,63,73,82,50,41,93,63,11,57],
            config: { metric: "Hippogryphs", unit: "" }
        },{
            vals: [2,7,99,77,14,10,23,21,16,2],
            config: { metric: "Wraiths", unit: "" }
        },{
            vals: [30,32,33,56,22,46,56,43,24,94],
            config: { 
                metric: "Donkeys",
                unit: "",
                threshold: 50
            }
        },{
            vals: [0,0,0,0,0,0,0,0,2,2],
            config: { 
                metric: "Phoenix",
                unit: "",
                threshold: 1
            }
        },{
            vals: [65,63,73,82,50,41,93,63,11,57],
            config: { metric: "Dragons", unit: "" }
        },{
            vals: [65,63,73,82,50,41,93,63,11,57],
            config: { metric: "Werewolves", unit: "" }
        }]
    });
    sparklineGridEl.appendChild(grid.el);
    grid.render();


    /*
    let barEl = document.createElement("div");
    barEl.classList.add("content");
    barEl.style.width = "600px";
    contentEl.appendChild(barEl);

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
    */

})();
