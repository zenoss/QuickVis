/* jshint esnext: true */
(function(){
    "use strict";



    function defaultTemplate(vm){
        return `
            <strong>hi</strong>
        `;
    }

    // a quick n purty visualization
    class QuickVis {
        // creates a dom element for the vis to live in
        constructor(){
            this.el = document.createElement("div");
            this.template = defaultTemplate;
        }

        // stores the data then calls render
        render(data){
            this.data = data;
            this._render();
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

    function sparklineTemplate(vm){
        return `
            <div class="metric">${vm.metric}</div>
            <div class="hbox spark-content">
                <svg class="graph"></svg>
                <div class="last">${vm.getLast()}</div>
                <div class="vbox spark-value">
                    <div class="units">GB</div>
                    <div class="hbox spark-trend ${vm.getDeltaDirectionClass()}">
                        <div class="trend">${vm.getDeltaDirectionArrow()}</div>
                        <div class="delta">${Math.abs(vm.getDelta())}</div>
                    </div>
                </div>
                <div class="indicator ${vm.getIndicatorStatus()}"></div>
            </div>
        `;
    }

    class Sparkline extends QuickVis {
        constructor(config){
            super();
            this.el.classList.add("sparkline");
            this.metric = config.metric;
            this.threshold = config.threshold;
            this.template = sparklineTemplate;
        }

        _render(){
            super._render();
            this.svg = this.el.querySelector(".graph");
            // TODO - determine height
            // TODO - draw series
            // TODO - draw threshold
        }

        /*************
         * VM METHODS
         * vm methods transform model data into something
         * the view can use to make data useful to the user
         */
        getLast(){
            return this.data[this.data.length-1];
        }

        getDelta(){
            let lastTwo = this.data.slice(-2);
            return lastTwo[1] - lastTwo[0];
        }

        getDeltaDirectionArrow(){
            let delta = this.getDelta();
            return delta > 0 ? "▴" : delta === 0 ? "" : "▾";
        }

        getDeltaDirectionClass(){
            let delta = this.getDelta();
            return delta > 0 ? "up" : delta === 0 ? "" : "down";
        }

        lastExceedsThreshold(){
            return this.getLast() > this.threshold;
        }

        getIndicatorStatus(){
            return this.lastExceedsThreshold() ? "on" : "off";
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
            super();
            this.el.classList.add("stacked-bar");
            this.name = config.name;
            this.capacity = config.capacity;
            this.template = stackedBarTemplate;
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

    if(!window.quickVis){
        window.quickVis = {};
    }
    window.quickVis.QuickVis = QuickVis;
    window.quickVis.Sparkline = Sparkline;
    window.quickVis.StackedBar = StackedBar;
})();
