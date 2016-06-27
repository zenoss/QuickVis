/* jshint esnext: true */
(function(){
    "use strict";

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
    function createNode(n, v) {
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
    // actual number may be less than this
    const DEFAULT_MAX_FLOAT_PRECISION = 1;

    function toEng(val, preferredUnit, width=DEFAULT_MAX_FLOAT_PRECISION+1, base=1000) {
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

        return [shortenNumber(result, width), symbol];
    }

    // attempts to make a long floating point number
    // fit in `length` characters. It will trim the
    // fractional part of the number, but never the
    // whole part of the number
    // NOTE - does not round the number! it just chops it off
    function shortenNumber(num, targetLength) {
        let numStr = num.toString(),
            parts = numStr.split("."),
            whole = parts[0],
            fractional = parts[1] || "";

        // if the number is already short enough
        if (whole.length + fractional.length <= targetLength) {
            return num;
        }

        // if the whole part of the number is
        // too long, return it as is. we tried our best.
        if (whole.length >= targetLength) {
            return +whole;
        }

        return parseFloat(whole + "." + fractional.substring(0, targetLength - whole.length));
    }

    // a quick n purty visualization
    class QuickVis {
        // creates a dom element for the vis to live in
        constructor(){
            this.el = document.createElement("div");
            this.template = function(vm){
                return `<strong>hi</strong>`;
            };

        }

        // stores the data then calls render
        // NOTE: el must be attached to the DOM to get
        // predictable results here!
        render(data){
            this._update(data);
            // TODO - if not attached to DOM, throw
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

    if(!window.quickVis){
        window.quickVis = {};
    }
    Object.assign(window.quickVis, {
        QuickVis,
        linearScale,
        createNode,
        toEng,
        shortenNumber
    });
})();
