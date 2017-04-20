(function(){
    "use strict";

    var {StackedBar, Sparkline, WinLoss, Bar, VisGrid} = quickvis;

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

    let focusables = [];

    // demo the focus line across all sparklines
    document.querySelector(".content-wrap").addEventListener("mousemove", e => {
        let x = e.pageX - e.currentTarget.offsetLeft,
            val = x / e.currentTarget.clientWidth;
        if(val < 0){
            val = 0;
        }
        // NOTE - this calculation assumes all sparklines are showing the same
        // "range" of data. It is up to the caller to pass in the right value
        focusables.forEach(s => s.focus(val));
    });
    document.querySelector(".content-wrap").addEventListener("mouseleave", e => {
        focusables.forEach(s => s.blur());
    });

    // just like, make a sparkline and attach
    // to dom el with specified index
    function attachSparky(index, config, vals){
        var sparkyEl = document.querySelectorAll(".sparky")[index];
        var sparky = new Sparkline(vals, config);
        focusables.push(sparky);
        sparkyEl.appendChild(sparky.el);
    }

    function attachStacked(index, config, vals){
        var stackedEl = document.querySelectorAll(".stacked")[index];
        var stacked = new StackedBar(vals, config);
        stackedEl.appendChild(stacked.el);
    }

    // setup webpage
    // night mode toggle
    document.querySelector(".night-toggle").addEventListener("click", function(e){
        document.body.classList.toggle("night"); 
    });

    // setup example quickvis's
    // basic sparkline
    attachSparky(0, {
        label: "Horses",
    }, [1, 4, 7, 18, 24, 98, 97, 90]);

    // more sparkline options
    attachSparky(1, {
        label: "Narwhals",
        style: "area",
        unit: "❤"
    }, [1, 4, 7, 18, 24, 98, 97, 90]);

    // large numbers
    attachSparky(2, {
        label: "Camels",
    },[916575094, 37473322, 783412004, 787777074, 957795371, 291285024, 847501582, 265160769, 71343712, 979961954]);

    // sparkline with threshold
    attachSparky(3, {
        label: "Turtles",
        style: "line",
        threshold: 50
    }, [1, 4, 7, 18, 24, 98, 97, 90]);

    // sparkline with forced threshold
    attachSparky(4, {
        label: "Ducks",
        style: "line",
        threshold: 50,
        forceThreshold: true
    }, [1, 4, 7, 18, 24, 20, 22, 23]);

    // styles
    ["line", "area", "bar", "scatter"].forEach(function(style){
        attachSparky(5, {
            label: style,
            style: style,
            threshold: 50
        }, [1, 4, 7, 18, 24, 95, 90, Math.random() * 100]);
    });

    attachStacked(0, {}, [
        { val: 20000 },
        { val: 30000 },
        { val: 1120 },
        { val: 20000 },
        { val: 105000 }
    ]);

    attachStacked(1, {
        label: "My Disk",
    }, [
        { name: "Games", val: 20000 },
        { name: "Jim", val: 30000 },
        { name: "AUTOEXEC.BAT", val: 1120 },
        { name: "Program Files", val: 20000 },
        { name: "pagefile.sys", val: 105000 }
    ]);

    attachStacked(2, {
        label: "My Disk",
        capacity: 200000
    }, [
        { name: "Games", val: 20000 },
        { name: "Jim", val: 30000 },
        { name: "AUTOEXEC.BAT", val: 1120 },
        { name: "Program Files", val: 20000 },
        { name: "pagefile.sys", val: 105000 }
    ]);

    attachStacked(3, {
        label: "My Disk",
        capacity: 200000,
        threshold: 200000 * 0.8
    }, [
        { name: "Games", val: 20000 },
        { name: "Jim", val: 30000 },
        { name: "AUTOEXEC.BAT", val: 1120 },
        { name: "Program Files", val: 20000 },
        { name: "pagefile.sys", val: 105000 }
    ]);

    var barEl = document.querySelector(".bar-wrap");
    var bar = new Bar(
        [65,63,73,82,50,41,93,63,11,57],
        {
            label: "simple",
            capacity: 100,
            threshold: 50
        }
    );
    barEl.appendChild(bar.el);
    focusables.push(bar);

    // bar grids
    var gridEl = document.querySelector(".grid-wrap");
    var vis = [
        new Sparkline([98,72,6,18,18,123,95,38,1023,11], {label: "horses", threshold: 500}),
        new WinLoss([1,1,1,1,0,0,null,null,0,0,1,1,1,0,1,1], {label: "horses2cat", tickCount: 15}),
        new Sparkline([30,32,33,56,22,46,56,43,24,94], {label: "cats"}),
        new WinLoss([1,1,0,0,1,1,0,0,0,0,1,1,1,0,1,1], {label: "horses2owl", tickCount: 15}),
        new WinLoss([1,1,0,0,1,0,1,1,1,1,0,1,1,0,1,1], {label: "humans", tickCount: 15}),
        new Bar([65,63,73,82,50,41,93,63,11,57], {
            label: "bear bar",
            capacity: 100,
            threshold: 75
        })
    ];
    var grid = new VisGrid({vis: vis});
    focusables.push(grid);
    gridEl.appendChild(grid.el);

    var winLossEl = document.querySelector(".win-loss-wrap");
    var data = [];
    for(let j = 0; j < 20; j++){
        let val = 1;
        if(Math.random() > 0.9){
            val = null;
        } else if(Math.random() > 0.5){
            val = 0;
        }
        data.push(val);
    }
    var wl = new WinLoss(data, {
        label: "win or lose",
        tickCount: 15
    });
    winLossEl.appendChild(wl.el);
    focusables.push(wl);
})();
