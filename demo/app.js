(function(){
    "use strict";

    var {StackedBar, Sparkline, SparklineGrid} = quickvis;

    function rand(min, max, floor){
        var val = (Math.random() * (max - min)) + min;
        return floor ? Math.floor(val) : val;
    }
    function randVals(min, max, count=1){
        var a = [];
        for(var i = 0; i < count; i++){
            a.push(rand(min,max));
        }
        return a;
    }

    function trendyRandVals(min, max, count=1){
        var vals = [rand(min,max)],
            violence = 0.2,
            dirRange = ((max - min) / count) * 2,
            dir = rand(-dirRange,dirRange);

        for(var i = 0; i < count-1; i++){
            if(rand(0,1) >= violence){
                dir = rand(-dirRange,dirRange);
            }
            vals.push(rand(vals[i], vals[i]+dir));
        }
        return vals;
    }

    let sparks = [];

    // demo the focus line across all sparklines
    document.querySelector(".content-wrap").addEventListener("mousemove", e => {
        let x = e.pageX - e.currentTarget.offsetLeft,
            val = x / e.currentTarget.clientWidth;
        // NOTE - this calculation assumes all sparklines are showing the same
        // "range" of data. It is up to the caller to pass in the right value
        sparks.forEach(s => s.focus(val));
    });
    document.querySelector(".content-wrap").addEventListener("mouseleave", e => {
        sparks.forEach(s => s.blur());
    });

    // just like, make a sparkline and attach
    // to dom el with specified index
    function attachSparky(index, config, vals){
        var sparkyEl = document.querySelectorAll(".sparky")[index];
        var sparky = new Sparkline(config);
        sparks.push(sparky);
        sparkyEl.appendChild(sparky.el);
        sparky.render(vals);
    }

    function attachStacked(index, config, vals){
        var stackedEl = document.querySelectorAll(".stacked")[index];
        var stacked = new StackedBar(config);
        stackedEl.appendChild(stacked.el);
        stacked.render(vals);
    }


    // setup webpage
    // night mode toggle
    document.querySelector(".night-toggle").addEventListener("click", function(e){
        document.body.classList.toggle("night"); 
    });

    // setup example quickvis's
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
    ["line", "area", "bar", "scatter"].forEach(function(style){
        attachSparky(5, {
            metric: style,
            style: style,
            threshold: 50
        }, [1, 4, 7, 18, 24, 95, 90, Math.random() * 100]);
    });

    // sparkline grids
    var sparklineGridEl = document.querySelector(".sparkline-grid");
    var grid = new SparklineGrid({
        hideLast: true,
        sparklines: [
            { metric: "Unicorns", unit: "" },
            { metric: "Pegasii", unit: "" },
            { metric: "Minotaurs", unit: "" },
            { metric: "Deepcrows", unit: "" },
            { metric: "Hippogryphs", unit: "" },
            { metric: "Wraiths", unit: "" },
            { 
                metric: "Donkeys",
                unit: "",
                threshold: 50
            },
            { 
                metric: "Phoenix",
                unit: "",
                threshold: 1
            },
            { metric: "Dragons", unit: "" },
            { metric: "Werewolves", unit: "" }
        ]
    });
    sparklineGridEl.appendChild(grid.el);
    grid.render([
        [98,72,6,18,18,27,95,38,54,11],
        [2,7,99,77,14,10,23,21,16,2],
        [30,32,33,56,22,46,56,43,24,94],
        [23,65,49,57,34,43,16,48,29,96],
        [65,63,73,82,50,41,93,63,11,57],
        [2,7,99,77,14,10,23,21,16,2],
        [30,32,33,56,22,46,56,43,24,94],
        [0,0,0,0,0,0,0,0,2,2],
        [65,63,73,82,50,41,93,63,11,57],
        [65,63,73,82,50,41,93,63,11,57],
    ]);
    sparks.push(grid);

    attachStacked(0, {}, [
        { val: 20000 },
        { val: 30000 },
        { val: 1120 },
        { val: 20000 },
        { val: 105000 }
    ]);

    attachStacked(1, {
        name: "My Disk",
    }, [
        { name: "Games", val: 20000 },
        { name: "Jim", val: 30000 },
        { name: "AUTOEXEC.BAT", val: 1120 },
        { name: "Program Files", val: 20000 },
        { name: "pagefile.sys", val: 105000 }
    ]);

    attachStacked(2, {
        name: "My Disk",
        capacity: 200000
    }, [
        { name: "Games", val: 20000 },
        { name: "Jim", val: 30000 },
        { name: "AUTOEXEC.BAT", val: 1120 },
        { name: "Program Files", val: 20000 },
        { name: "pagefile.sys", val: 105000 }
    ]);

    attachStacked(3, {
        name: "My Disk",
        capacity: 200000,
        threshold: 200000 * 0.8
    }, [
        { name: "Games", val: 20000 },
        { name: "Jim", val: 30000 },
        { name: "AUTOEXEC.BAT", val: 1120 },
        { name: "Program Files", val: 20000 },
        { name: "pagefile.sys", val: 105000 }
    ]);



})();
