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

export {
    linearScale,
    createNode,
    toEng,
    shortenNumber,
    getFormattedNumber
};
