
(function injectCSS(){
    let style = document.createElement("style");
    style.innerHTML = ".vbox{display:flex;flex-direction:column}.hbox{display:flex;flex-direction:row} .stacked-bar *{display:flex}.stacked-bar{color:#555}.stacked-bar .stacked-title{align-items:flex-end;margin-bottom:2px}.stacked-bar .stacked-title .name{font-size:1.3em}.stacked-bar .stacked-title .capacity{margin-left:auto;color:#999}.stacked-bar .bars{height:30px;position:relative;border:solid #999 1px;background-color:#EEE;min-width:0}.stacked-bar .bars .bar{align-items:center;background-color:#555;color:#EEE;font-weight:bold;font-size:0.9em;padding-left:3px;overflow:hidden;text-overflow:ellipsis}.stacked-bar .bars .bar.empty{background-color:#EEE} .sparkline{color:#555}.sparkline .metric{font-size:1.2em}.sparkline .spark-content{align-items:center}.sparkline .graph{flex:1 1 120px;margin-right:6px;height:2em}.sparkline .graph .sparkline-path{stroke:#555;stroke-width:1;fill:transparent}.sparkline .graph .sparkline-path.shaded{stroke:transparent;fill:#CCC}.sparkline .graph .sparkline-bar{stroke:transparent;fill:#AAA}.sparkline .graph .sparkline-bar.bad{fill:#9C1200}.sparkline .graph .sparkline-scatter,.sparkline .graph .sparkline-last-point{fill:#AAA}.sparkline .graph .sparkline-scatter.bad,.sparkline .graph .sparkline-last-point.bad{fill:#9C1200}.sparkline .graph .sparkline-threshold{stroke:#AAA;stroke-width:2;stroke-dasharray:2, 2;fill:transparent}.sparkline .last{font-size:2em;display:flex;align-items:baseline;line-height:0.7em;letter-spacing:-1px}.sparkline .last-val{margin-right:2px}.sparkline .units{font-size:0.8em;color:#AAA}.sparkline .annotation{font-size:0.9em;color:#AAA;margin-left:2px}.sparkline .indicator:after{display:flex;font-size:1.5em;margin:-5px 5px 0 5px;color:transparent;content:'●'}.sparkline .indicator.on:after{color:#9C1200}.sparkline.compact .graph{flex:1 1 50px;margin-right:6px;height:1.5em}.sparkline.compact .last{letter-spacing:0;font-size:1.5em}.sparkline.compact .indicator{height:1.4em}.sparkline.row{display:table-row}.sparkline.row .metric{display:table-cell;font-size:0.8em}.sparkline.row .graph-row{display:table-cell}.sparkline.row .graph{width:100%;height:1em}.sparkline.row .last{display:table-cell;letter-spacing:0;font-size:1em;text-align:right;white-space:nowrap}.sparkline.row .last-val{font-weight:bold}.sparkline.row .units{font-size:1em;color:#555}.sparkline.row .indicator{display:table-cell;height:1.3em} .sparkline-grid .sparklines{width:100%;table-layout:auto}";
    document.body.appendChild(style);
    // force layout/paint
    document.querySelector("body").clientWidth;
})();
    

var quickvis = (function () {
    'use strict';

    // a quick n purty visualization
    class QuickVis {
        // creates a dom element for the vis to live in
        constructor(config){
            config = config || {};
            this.el = document.createElement(config.tag || "div");
            this.template = config.template || function(vm){
                return `<strong>hi</strong>`;
            };

        }

        // stores the data then calls render
        // NOTE: el must be attached to the DOM to get
        // predictable results here!
        render(data){
            if(!document.body.contains(this.el)){
                console.warn("Element is not attached to the DOM. This may produce unexpected issues with element layout");
            }
            this._update(data);
            this._render();
        }

        // do some work with incoming data
        _update(data){
            this.data = data;
        }

        // private implementation of render. applies
        // vm to template and replaces html inside of
        // vis's dom el
        _render(){
            let htmlStr = this.template(this);
            // NOTE - make sure any event listeners
            // or references to DOM elements have
            // been cleared or this will leak!
            this.el.innerHTML = htmlStr;
        }
    }

    // from https://github.com/mapbox/simple-linear-scaleA
    // TODO - check license for this function
    function linearScale(domain, range, clamp) {
        return function(value) {
            if (domain[0] === domain[1] || range[0] === range[1]) {
                return range[0];
            }
            let ratio = (range[1] - range[0]) / (domain[1] - domain[0]),
                result = range[0] + ratio * (value - domain[0]);
            return clamp ? Math.min(range[1], Math.max(range[0], result)) : result;
        };
    }

    // http://stackoverflow.com/a/37411738
    function createSVGNode(n, v) {
        n = document.createElementNS("http://www.w3.org/2000/svg", n);
        for (let p in v){
            n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
        }
        return n;
    }

    let SYMBOLS = {
        "-8": "y",
        "-7:": "z",
        "-6": "a",
        "-5": "f",
        "-4": "p",
        "-3": "n",
        "-2": "u",
        "-1": "m",
        "0": "",
        "1": "K",
        "2": "M",
        "3": "G",
        "4": "T",
        "5": "P",
        "6": "E",
        "7": "Z",
        "8": "Y"
    };

    // max number of places after the decimal point.
    // actual number after decimal may end up being less than this
    const DEFAULT_MAX_FLOAT_PRECISION = 2;

    function toEng(val, preferredUnit, width=DEFAULT_MAX_FLOAT_PRECISION, base=1000) {
        let sign = val < 0 ? -1 : 1;
        val = Math.abs(val);

        let result,
            unit,
            symbol;

        // if preferredUnit is provided, target that value
        if (preferredUnit !== undefined) {
            unit = preferredUnit;
        } else if (val === 0) {
            unit = 0;
        } else {
            unit = Math.floor(Math.log(Math.abs(val)) / Math.log(base));
        }

        symbol = SYMBOLS[unit];

        // TODO - if Math.abs(unit) > 8, return value in scientific notation
        result = val / Math.pow(base, unit);

        return [
            // shorten the number if its too long, add sign back
            sign * shortenNumber(result, width),
            symbol
        ];
    }

    // attempts to make a long floating point number
    // fit in `length` characters. It will trim the
    // fractional part of the number, but never the
    // whole part of the number
    // NOTE - does not round the number! it just chops it off
    function shortenNumber(num, targetLength=DEFAULT_MAX_FLOAT_PRECISION){
        let numStr = num.toString(),
            parts = numStr.split("."),
            whole = parts[0],
            fractional = parts[1] || "",
            sign = "";

        // if negative, slice off the minus sign
        // so that we can count the number of digits
        if(whole[0] === "-"){
            whole = whole.substr(1);
        }

        // if the number is already short enough
        if (whole.length + fractional.length <= targetLength) {
            return num;
        }

        // if the whole part of the number is
        // too long, return it as is. we tried our best.
        if (whole.length >= targetLength) {
            return +whole;
        }

        return parseFloat(sign + whole + "." + fractional.substring(0, targetLength - whole.length));
    }

    // given a value, returns an array where
    // index 0 is between 0 and 999, and
    // index 1 describes the magnitude of the
    // value. long floating point values are
    // shortened
    function getFormattedNumber(val){
        let result;

        // if this number is a float, attempt
        // to shorten it
        if(Math.abs(val) < 1){
            result = [shortenNumber(val), ""];
        } else {
            result = toEng(val);
        }

        return result;
    }

    // template functions should take a viewmodel and return a string
    // that can be put into the DOM. there should be as little logic in
    // here as possible. Prefer to create viewmodel methods to handle
    // logic.
    function fullTemplate(vm){
        return `
        <div class="metric">${vm.metric}</div>
        <div class="hbox spark-content">
            <svg class="graph"></svg>
            <div style="display: flex; flex-flow: column nowrap">
                <div class="last">
                    <div class="last-val">${vm.getFriendly(vm.last)}</div>
                    <div class="units">${vm.getMagnitude(vm.last) + vm.unit}</div>
                </div>
                <div class="annotation">${vm.getAnnotation()}</div>
            </div>
            <div class="indicator ${vm.getIndicatorStatus()}"></div>
        </div>
    `;
    }

    function compactTemplate(vm){
        return `
        <div class="metric">${vm.metric}</div>
        <div class="hbox spark-content">
            <svg class="graph"></svg>
            <div class="last">
                <span class="last-val">${vm.getFriendly(vm.last)}</span>
                <span class="units">${vm.getMagnitude(vm.last) + vm.unit}</span>
            </div>
            <div class="indicator ${vm.getIndicatorStatus()}"></div>
        </div>
    `;
    }

    function rowTemplate(vm){
        return `
        <div class="metric">${vm.metric}</div>
        <div class="graph-row"><svg class="graph"></svg></div>
        <div class="last">
            <!-- NOTE: the html comment after this span is to prevent
                extra whitespace being added between the 2 elements -->
            <span class="last-val">${vm.getFriendly(vm.last)}</span><!--
            --><span class="units">${vm.getMagnitude(vm.last) + vm.unit}</span>
        </div>
        <div class="indicator ${vm.getIndicatorStatus()}"></div>
    `;
    }

    let templates = {
        full: fullTemplate,
        compact: compactTemplate,
        row: rowTemplate
    };

    const SPARKLINE_PADDING = 4;
    const SPARKLINE_DATA_PADDING = 1;

    const defaultConfig = {
        metric: "",
        style: "line",
        threshold: Infinity,
        layout: "full",
        template: fullTemplate,
        unit: "B"
    };

    class Sparkline extends QuickVis {
        // setup configuration related thingies
        constructor(config){
            config = Object.assign({}, defaultConfig, config);

            config.template = templates[config.layout];
            if(!config.template){
                throw new Error(`Invalid sparkline layout '${config.layout}'`);
            }

            super(config);
            this.el.classList.add("sparkline");
            this.el.classList.add(config.layout);
            this.metric = config.metric;
            this.threshold = config.threshold;
            this.forceThreshold = config.forceThreshold;
            this.style = config.style;
            this.unit = config.unit;
            this.annotation = config.annotation;
        }

        // update the model data and generate new data as
        // needed from the model data. Do not modify the model,
        // and if new data is needed, be sure its actual data
        // and not just view-related stuff (like text formatting)
        _update(data){
            if(!data || !data.length){
                throw new Error("cannot create sparkline from empty data");
            }

            this.data = data;
            this.last = data[data.length - 1];
        }

        /*******************
         * rendering and drawing functions are the only place
         * that it is ok to touch the dom!
         */
        _render(){
            super._render();
            this.svg = this.el.querySelector(".graph");
            let bb = this.svg.getBoundingClientRect();
            this.setScales(bb.width, bb.height);
            this.setDrawableArea(bb.width, bb.height);

            switch(this.style){
                case "area":
                    this.fillSparkline()
                        .drawSparkline()
                        .drawThreshold();
                    break;
                case "line":
                    this.drawSparkline()
                        .drawThreshold();
                    break;
                case "bar":
                    this.drawBars()
                        .drawThreshold();
                    break;
                case "scatter":
                    this.drawScatter()
                        .drawThreshold();
                    break;
            }
        }

        // sets up x and y scales, with consideration to including
        // padding in the drawable area
        setScales(width, height){
            let dataRange = this.data;

            // if forceThreshold, add it to the dataRange
            // so that min/max will include it
            if(this.forceThreshold){
                dataRange = dataRange.concat(this.threshold);
            }

            let min = Math.min.apply(Math, dataRange),
                max = Math.max.apply(Math, dataRange);

            this.xDomain = [0, this.data.length-1];
            // NOTE - min and max are swappped since the 
            // 0,0 origin is upper left (aka going down on
            // y axis is actually incrementing the y value)
            this.yDomain = [max + SPARKLINE_DATA_PADDING, min - SPARKLINE_DATA_PADDING];
            this.xScale = linearScale(this.xDomain, [SPARKLINE_PADDING, width-SPARKLINE_PADDING]);
            this.yScale = linearScale(this.yDomain, [SPARKLINE_PADDING, height-SPARKLINE_PADDING]);
        }

        // creates the bounds of the drawable area of the svg
        // to prevent elements from being clipped off the edges
        setDrawableArea(width, height){
            if(!this.xScale || !this.yScale){
                throw new Error("Cannot setup drawable area; scales have not been setup");
            }

            this.drawableArea = {
                x1: this.xScale(this.xDomain[0]),
                y1: this.yScale(this.yDomain[0]),
                x2: this.xScale(this.xDomain[1]),
                y2: this.yScale(this.yDomain[1])
            };
            this.drawableArea.width = this.drawableArea.x2 - this.drawableArea.x1;
            this.drawableArea.height = this.drawableArea.y2 - this.drawableArea.y1;

        }

        fillSparkline(){
            this.drawSparkline(true);
            return this;
        }

        drawSparkline(shaded=false){
            let {svg, xScale, yScale} = this,
                {x1, y1, x2, y2} = this.drawableArea,
                d = [];

            if(shaded){
                d.push(`M${x1},${y2}`);
                d.push(`L${x1},${y1}`);
            } else {
                //d.push(`M${x1},${y2}`);
                d.push(`M${x1},${yScale(this.data[0])}`);
            }
            this.data.forEach((dp, i) => {
                d.push(`L${xScale(i)},${yScale(dp)}`);
            });
            if(shaded){
                d.push(`L${x2},${y2}`);
            }

            svg.appendChild(createSVGNode("path", {
                d: d.join(" "),
                class: "sparkline-path" + (shaded ? " shaded" : "")
            }));
            return this;
        }

        drawBars(){
            const BAR_PADDING = 2;
            let {svg, xScale, yScale} = this,
                {x2, y2, width} = this.drawableArea,
                barWidth = (width / (this.data.length)) - BAR_PADDING,
                offsetLeft = xScale(0);

            this.data.forEach((dp, i) => {
                let barDiff = this.yScale(dp),
                    barHeight = Math.ceil(y2 - barDiff) || 1;
                svg.appendChild(createSVGNode("rect", {
                    // TODO - dont apply padding to last item
                    x: offsetLeft + ((barWidth + BAR_PADDING) * i),
                    y: y2 - barHeight,
                    width: barWidth,
                    height: barHeight,
                    class: "sparkline-bar" + (dp > this.threshold ? " bad" : "")
                }));
            });
            return this;
        }

        drawScatter(){
            let {svg, xScale, yScale} = this,
                {x2, y2, width} = this.drawableArea;

            this.data.forEach((dp, i) => {
                svg.appendChild(createSVGNode("circle", {
                    cx: this.xScale(i),
                    cy: this.yScale(dp),
                    r: 4,
                    class: "sparkline-scatter" + (dp > this.threshold ? " bad" : "")
                }));
            });
            return this;
        }

        drawThreshold(){
            if(this.threshold === Infinity){
                return this;
            }

            let {svg, xScale, yScale} = this,
                {x1, y1, x2, y2} = this.drawableArea;
            svg.appendChild(createSVGNode("line", {
                x1: x1,
                y1: yScale(this.threshold),
                x2: x2,
                y2: yScale(this.threshold),
                class: "sparkline-threshold"
            }));
            return this;
        }

        drawLastPoint(){
            let {svg, xScale, yScale} = this,
                x = this.data.length - 1,
                y = this.data[this.data.length-1];
            svg.appendChild(createSVGNode("circle", {
                cx: xScale(x),
                cy: yScale(y),
                r: 3,
                class: "sparkline-last-point" + (this.lastExceedsThreshold() ? " bad" : "")
            }));
            return this;
        }

        /*************
         * vm methods transform model data into something
         * the view can use to make data useful to the user
         */
        getFriendly(val){
            return getFormattedNumber(val)[0];
        }

        getMagnitude(val){
            return getFormattedNumber(val)[1];
        }

        lastExceedsThreshold(){
            return this.last > this.threshold;
        }

        getIndicatorStatus(){
            return this.lastExceedsThreshold() ? "on" : "off";
        }

        getAnnotation(){
            return this.annotation || "";
        }
    }

    function stackedBarTemplate(vm){
        return `
        <div class="hbox stacked-title">
            <div class="name">${vm.name}</div>
            <div class="capacity">${vm.capacity}TB</div>
        </div>
        <div class="bars">
            ${vm.data.map(bar => barTemplate(vm, bar)).join("")}
            <!-- empty bar for free space -->
            ${barTemplate(vm, {name:"free", val: vm.capacity - vm.getTotal()})}
        </div>
    `;
    }

    function barTemplate(vm, bar){
        return `
        <div class="bar" style="flex: ${vm.getRatio(bar.val)} 0 0; background-color: ${vm.getColor(bar)};"
        title="${bar.name +": "+ bar.val}">
            ${bar.name.replace(" ", "&nbsp;")}
        </div>
    `;
    }

    // TODO - better palette
    let colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
        "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

    class StackedBar extends QuickVis {
        constructor(config){
            config.template = stackedBarTemplate;
            super(config);
            this.el.classList.add("stacked-bar");
            this.name = config.name;
            this.capacity = config.capacity;
        }

        _render(){
            super._render();
            this.barsEl = this.el.querySelector(".bars");
        }

        getTotal(){
            return this.data.reduce((acc, d) => acc + d.val, 0);
        }

        // returns fraction of capacity that val occupies
        getRatio(val){
            return this.capacity / val;
        }

        getColor(bar){
            // empty bar for free space
            if(bar.name === "free"){
                return "transparent";
            } else {
                // TODO - choose colors
                return colors[this.getIndexOf(bar)];
            }
        }

        getIndexOf(bar){
            return this.data.indexOf(bar);
        }
    }

    function template(vm){
        return `
        <table class="sparklines"></table>
    `;
    }

    class SparklineGrid extends QuickVis {

        constructor(config){
            super(config);
            this.template = template;

            this.el.classList.add("sparkline-grid");
            this.sparklines = config.sparklines.map(c => {
                // TODO - reevaluate config object
                c.config.layout = "row";
                let sparky = new Sparkline(c.config);
                return {
                    config: c.config,
                    vals: c.vals,
                    sparkline: sparky
                };
            });
        }

        _render(){
            super._render();
            let sparklinesEl = this.el.querySelector(".sparklines");
            // TODO - detach sparklinesEl first?
            this.sparklines.forEach(s => {
                sparklinesEl.appendChild(s.sparkline.el);
                s.sparkline.render(s.vals);
            });
        }
    }

    var quickvis = {
        Sparkline,
        StackedBar,
        SparklineGrid
    };

    return quickvis;

}());

//# sourceMappingURL=quickvis-0.1.1-dev.js.map
