
(function injectCSS(){
    var style = document.createElement("style");
    style.innerHTML = ".vbox{display:flex;flex-direction:column}.hbox{display:flex;flex-direction:row} .sparkline{color:#555}.sparkline .metric{font-size:1.2em}.sparkline .spark-content{align-items:center}.sparkline .graph{flex:1 1 120px;margin-right:6px;height:2em}.sparkline .graph .sparkline-path{stroke:#555;stroke-width:1;fill:transparent}.sparkline .graph .sparkline-path.shaded{stroke:transparent;fill:#CCC}.sparkline .graph .sparkline-bar{stroke:transparent;fill:#AAA}.sparkline .graph .sparkline-bar.bad{fill:#9C1200}.sparkline .graph .sparkline-scatter,.sparkline .graph .sparkline-last-point{fill:#AAA}.sparkline .graph .sparkline-scatter.bad,.sparkline .graph .sparkline-last-point.bad{fill:#9C1200}.sparkline .graph .sparkline-threshold{stroke:#AAA;stroke-width:2;stroke-dasharray:2, 2;fill:transparent}.sparkline .graph .sparkline-focus{stroke:black;stroke-width:2;fill:transparent}.sparkline .last{font-size:2em;display:flex;align-items:baseline;line-height:0.7em;letter-spacing:-1px}.sparkline .last-val{margin-right:2px}.sparkline .units{font-size:0.8em;color:#AAA}.sparkline .annotation{font-size:0.9em;color:#AAA;margin-left:2px}.sparkline .indicator:after{display:flex;font-size:1.5em;margin:-5px 5px 0 5px;content:'○';color:#CCC}.sparkline .indicator.off:after{display:none}.sparkline .indicator.on:after{color:#9C1200;content:'●'} .bar-grid .bar-grid-bars{display:table;width:100%;table-layout:auto}.bar-grid .stacked-bar{display:table-row}.bar-grid .stacked-bar .name{display:table-cell;font-size:0.8em;text-align:right;padding-right:4px}.bar-grid .stacked-bar .bars-wrap{display:table-cell}.bar-grid .stacked-bar .bars{height:10px;border:none}.bar-grid .stacked-bar .bar{line-height:10px !important}.bar-grid .stacked-bar .bar.free .bar-label{visibility:hidden}.bar-grid .stacked-bar .threshold{height:16px !important;top:-3px !important;border-left:dotted #555 2px !important}.bar-grid .stacked-bar .indicator{display:table-cell;height:1.3em;position:relative;top:0;right:0;font-size:1.1em;padding-left:4px} .stacked-bar{position:relative}.stacked-bar .stacked-wrapper{display:flex;flex-direction:column;color:#555;margin-right:25px}.stacked-bar .name{font-size:1.3em;margin-bottom:2px}.stacked-bar .bars{display:flex;height:30px;position:relative;border:solid #999 1px;background-color:#EEE}.stacked-bar .bars .bar-color-none{background-color:transparent !important}.stacked-bar .bars .bar-color-0{background-color:#6A95A9 !important}.stacked-bar .bars .bar-color-1{background-color:#314F5C !important}.stacked-bar .bars .bar-color-2{background-color:#8F8B3E !important}.stacked-bar .bars .bar-color-3{background-color:#A8A551 !important}.stacked-bar .bars .bar-color-4{background-color:#3A583B !important}.stacked-bar .bars .bar-color-5{background-color:#5CA45E !important}.stacked-bar .bars .bar-color-6{background-color:#8B6A4E !important}.stacked-bar .bars .bar-color-7{background-color:#A48164 !important}.stacked-bar .bars .bar-color-8{background-color:#A44C73 !important}.stacked-bar .bars .bar-color-9{background-color:#572038 !important}.stacked-bar .bars .bar{background-color:#555;color:#EEE;font-weight:bold;font-size:0.9em;cursor:default;overflow:hidden;line-height:30px}.stacked-bar .bar .bar-label{margin:0 4px}.stacked-bar .bars .threshold{position:absolute;left:0;top:-6px;height:40px;background-color:white;border-left:dashed #555 2px}.stacked-bar .stacked-footer{font-size:0.8em;display:flex;padding-top:2px}.stacked-bar .stacked-footer .used,.stacked-bar .stacked-footer .free{margin-right:10px}.stacked-bar .stacked-footer .total{margin-left:auto}.stacked-bar .indicator{font-size:1.8em;position:absolute;bottom:30px;right:0}.stacked-bar .indicator:after{display:flex;color:transparent;content:'○';color:#CCC}.stacked-bar .indicator.off:after{display:none}.stacked-bar .indicator.on:after{color:#9C1200;content:'●'} .sparkline-grid .sparklines{display:table;width:100%;table-layout:auto}.sparkline-grid .sparkline{display:table-row}.sparkline-grid .sparkline .metric{display:table-cell;font-size:0.8em;text-align:right;padding-right:4px}.sparkline-grid .sparkline .graph-row{display:table-cell;padding-right:4px}.sparkline-grid .sparkline .graph{width:100%;height:1em;margin:0}.sparkline-grid .sparkline .last{display:table-cell;letter-spacing:0;font-size:1em;text-align:right;white-space:nowrap}.sparkline-grid .sparkline .last-val{font-weight:bold}.sparkline-grid .sparkline .units{font-size:1em;color:#555}.sparkline-grid .sparkline .indicator{display:table-cell;height:1.3em} .win-loss{display:flex}.win-loss.table-layout{display:table-row}.win-loss.table-layout .name,.win-loss.table-layout .winlosses,.win-loss.table-layout .win-percent,.win-loss.table-layout .indicator{display:table-cell;vertical-align:middle}.win-loss.table-layout .name{font-size:0.8em;text-align:right;padding-right:8px}.win-loss .name{color:#555;margin-right:8px}.win-loss .winloss-wrap{display:flex;flex:1}.win-loss .winlosses{flex:1;padding-right:4px}.win-loss .winloss{display:flex;flex-direction:column;flex:1}.win-loss .winloss-block{min-width:6px;height:6px;flex:1;margin-right:1px}.win-loss .topsies,.win-loss .bottomsies{display:flex}.win-loss .topsies{border-bottom:solid #888 1px}.win-loss .topsies .marked{background-color:#999}.win-loss .bottomsies .marked{background-color:#333}.win-loss .win-percent{padding-right:4px}.win-loss .indicator:after{display:flex;font-size:1.5em;content:'○';color:transparent;position:relative;top:-1px}.win-loss .indicator.bad:after{color:#9C1200;content:'●'}.win-loss.focused .winloss-block{opacity:0.4}.win-loss.focused .winloss-block.focused{opacity:1}";
    document.body.appendChild(style);
    // force layout/paint
    document.querySelector("body").clientWidth;
})();
    

/* QuickVis v0.1.4-dev */
var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/* globals console: true */
// donify provides a way to export a promises resolve
// and reject callbacks. to reject the promise, call
// the callback with a non-null value for the first argument.
// To resolve the promise, call the callback with `null` for
// the first argument and optionally a resolve value for the
// second argument

function donify(resolve, reject) {
    return function (err, data) {
        if (err !== null) {
            reject(err);
        } else {
            resolve(data);
        }
    };
}

var DOMBatcher = function () {
    function DOMBatcher(frequency) {
        classCallCheck(this, DOMBatcher);

        this.frequency = frequency;
        this.inserts = [];
        this.insertTimer = null;

        this.bboxs = [];
        this.bboxTimer = null;
    }

    createClass(DOMBatcher, [{
        key: "insert",
        value: function insert(el, str) {
            var done = void 0;
            var p = new Promise(function (resolve, reject) {
                done = donify(resolve, reject);
            });

            this.inserts.push([el, str, done]);
            if (!this.insertTimer) {
                this.insertTimer = setTimeout(this._insertForReal.bind(this), this.frequency);
            }

            return p;
        }
    }, {
        key: "_insertForReal",
        value: function _insertForReal() {
            console.log("performing " + this.inserts.length + " inserts");
            this.inserts.forEach(function (_ref) {
                var _ref2 = slicedToArray(_ref, 3),
                    el = _ref2[0],
                    str = _ref2[1],
                    done = _ref2[2];

                try {
                    el.innerHTML = str;
                    done(null);
                } catch (e) {
                    console.warn("couldnt insert html string", e);
                    done("couldnt insert html string" + e);
                }
            });
            this.inserts = [];
            this.insertTimer = null;
        }
    }, {
        key: "getBBox",
        value: function getBBox(el) {
            var done = void 0;
            var p = new Promise(function (resolve, reject) {
                done = donify(resolve, reject);
            });

            this.bboxs.push([el, done]);
            if (!this.bboxTimer) {
                this.bboxTimer = setTimeout(this._getBBoxForReal.bind(this), this.frequency);
            }

            return p;
        }
    }, {
        key: "_getBBoxForReal",
        value: function _getBBoxForReal() {
            console.log("getting " + this.bboxs.length + " bboxes");
            this.bboxs.forEach(function (_ref3) {
                var _ref4 = slicedToArray(_ref3, 2),
                    el = _ref4[0],
                    done = _ref4[1];

                try {
                    var bb = el.getBoundingClientRect();
                    done(null, bb);
                } catch (e) {
                    console.warn("couldnt get bbox", e);
                    done("couldnt get bbox" + e);
                }
            });
            this.bboxs = [];
            this.bboxTimer = null;
        }

        // does its best to guess if dom batching
        // stuff is done doing things

    }, {
        key: "working",
        value: function working() {
            var done = void 0;
            var p = new Promise(function (resolve, reject) {
                done = donify(resolve, reject);
            });
            var count = 0,
                maxRetries = 10;
            var self = this;
            (function recur() {
                if (count >= maxRetries) {
                    console.warn("gave up waiting for quickvis to finis");
                    done("gave up waiting for quickvis to finish");
                } else if (self.inserts.length + self.bboxs.length === 0) {
                    done(null);
                } else {
                    count++;
                    setTimeout(recur, 200);
                }
            })();
            return p;
        }
    }]);
    return DOMBatcher;
}();

var INSERT_FREQUENCY = 100;
var dom = new DOMBatcher(INSERT_FREQUENCY);

function working() {
    return dom.working();
}

// a quick n purty visualization

var QuickVis = function () {
    // creates a dom element for the vis to live in
    // NOTE: don't manipulate the DOM from here
    function QuickVis(config) {
        classCallCheck(this, QuickVis);

        config = config || {};
        this.el = document.createElement(config.tag || "div");
        this.template = config.template || function (vm) {
            return "<strong>hi</strong>";
        };
        this.rendered = false;
    }

    // stores the data then calls render
    // NOTE: el must be attached to the DOM to get
    // predictable results here!
    // NOTE: don't override this method. override _render


    createClass(QuickVis, [{
        key: "render",
        value: function render(data) {
            if (!document.body.contains(this.el)) {
                console.warn("Element is not attached to the DOM. This may produce unexpected issues with element layout");
            }
            this._update(data);
            // TODO - wait till after dom insert completes?
            this.rendered = true;
            return this._render();
        }

        // do some work with incoming data
        // NOTE: override this as needed
        // NOTE: don't manipulate the DOM from here

    }, {
        key: "_update",
        value: function _update(data) {
            this.data = data;
        }

        // private implementation of render. applies
        // vm to template and replaces html inside of
        // vis's dom el
        // NOTE: override this guy at will!
        // NOTE: It's ok for _render to call out to 
        // other methods to touch the DOM, but once 
        // _render's done, DOM time is OVER!
        // NOTE: don't touch the DOM outside of this.el

    }, {
        key: "_render",
        value: function _render() {
            var htmlStr = this.template(this);
            // NOTE - make sure any event listeners
            // or references to DOM elements have
            // been cleared or this will leak!
            //this.el.innerHTML = htmlStr;
            return dom.insert(this.el, htmlStr);
        }
    }, {
        key: "getBBox",
        value: function getBBox(el) {
            return dom.getBBox(el);
        }
    }]);
    return QuickVis;
}();

// from https://github.com/mapbox/simple-linear-scaleA
// TODO - check license for this function

function linearScale(domain, range, clamp) {
    return function (value) {
        if (domain[0] === domain[1] || range[0] === range[1]) {
            return range[0];
        }
        var ratio = (range[1] - range[0]) / (domain[1] - domain[0]),
            result = range[0] + ratio * (value - domain[0]);
        return clamp ? Math.min(range[1], Math.max(range[0], result)) : result;
    };
}

// http://stackoverflow.com/a/37411738
function createSVGNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v) {
        n.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
            return "-" + m.toLowerCase();
        }), v[p]);
    }
    return n;
}

var SYMBOLS = {
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
var DEFAULT_MAX_FLOAT_PRECISION = 2;

function toEng(val, preferredUnit) {
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_MAX_FLOAT_PRECISION;
    var base = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;

    var sign = val < 0 ? -1 : 1;
    val = Math.abs(val);

    var result = void 0,
        unit = void 0,
        symbol = void 0;

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
    sign * shortenNumber(result, width), symbol];
}

// attempts to make a long floating point number
// fit in `length` characters. It will trim the
// fractional part of the number, but never the
// whole part of the number
// NOTE - does not round the number! it just chops it off
function shortenNumber(num) {
    var targetLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_MAX_FLOAT_PRECISION;

    var numStr = num.toString(),
        parts = numStr.split("."),
        whole = parts[0],
        fractional = parts[1] || "",
        sign = "";

    // if negative, slice off the minus sign
    // so that we can count the number of digits
    if (whole[0] === "-") {
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
function getFormattedNumber(val) {
    var result = void 0;

    // if this number is a float, attempt
    // to shorten it
    if (Math.abs(val) < 1) {
        result = [shortenNumber(val), ""];
    } else {
        result = toEng(val);
    }

    return result;
}

// given an array of values, attempts to create an array of length
// maxLength by applying downsampleFunction to each slice
// of values
function downsampleData(data, maxLength, downsampleFn) {
    var length = data.length;
    var max = Math.min(length, maxLength);
    var count = Math.ceil(length / max);

    var downsampled = [];
    for (var i = 0; i < max; i++) {
        var start = i * count;
        var end = (i + 1) * count;
        if (end > length) {
            end = length;
        }
        var slice = data.slice(start, end);
        var val = downsampleFn(slice);
        /*
        let val = slice.reduce((agg, v) => {
            if(agg === null && v === null){
                return null;
            } else if (agg === null){
                return v;
            } else {
                return Math.max(agg, v);
            }
        }, null);
        */
        downsampled.push(val);
    }

    return downsampled;
}
// returns either the largest number, or null
// if all values in the array are null
downsampleData.MAX = function (slice) {
    return slice.reduce(function (agg, v) {
        if (agg === null && v === null) {
            return null;
        } else if (agg === null) {
            return v;
        } else {
            return Math.max(agg, v);
        }
    }, null);
};

// template functions should take a viewmodel and return a string
// that can be put into the DOM. there should be as little logic in
// here as possible. Prefer to create viewmodel methods to handle
// logic.
function template(vm) {
    return "\n        <div class=\"metric\">" + vm.metric + "</div>\n        <div class=\"hbox spark-content\">\n            <svg class=\"graph\"></svg>\n            <div style=\"display: flex; flex-flow: column nowrap\">\n                <div class=\"last\">\n                    <div class=\"last-val\" style=\"" + (vm.hideLast ? "display:none;" : "") + "\">" + vm.getFriendly(vm.last) + "</div>\n                    <div class=\"units\">" + (vm.getMagnitude(vm.last) + vm.unit) + "</div>\n                </div>\n                <div class=\"annotation\">" + vm.getAnnotation() + "</div>\n            </div>\n            <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n        </div>\n    ";
}

var SPARKLINE_PADDING = 4;
var SPARKLINE_DATA_PADDING = 1;

var defaultConfig = {
    metric: "",
    style: "line",
    threshold: Infinity,
    template: template,
    unit: "B"
};

var Sparkline = function (_QuickVis) {
    inherits(Sparkline, _QuickVis);

    // setup configuration related thingies
    function Sparkline(config) {
        classCallCheck(this, Sparkline);

        // dont let undefined value override default
        if (config.threshold === undefined) {
            delete config.threshold;
        }

        config = Object.assign({}, defaultConfig, config);

        var _this = possibleConstructorReturn(this, (Sparkline.__proto__ || Object.getPrototypeOf(Sparkline)).call(this, config));

        _this.el.classList.add("sparkline");
        _this.metric = config.metric;
        _this.forceThreshold = config.forceThreshold;
        _this.style = config.style;
        _this.unit = config.unit;
        _this.annotation = config.annotation;
        _this.hideLast = config.hideLast;
        _this.showLastPoint = config.showLastPoint;

        _this.focusLines = [];

        if (config.threshold !== undefined) {
            _this.threshold = config.threshold;
        }
        return _this;
    }

    // draw a focus line for each value. values should be
    // 0 - 1 (effectivly 0% - 100%)


    createClass(Sparkline, [{
        key: "focus",
        value: function focus(vals) {
            var _this2 = this;

            if (!this.rendered) {
                return;
            }

            // add focus lines to the pool as needed
            while (this.focusLines.length < vals.length) {
                this.drawFocusLine();
            }

            // TODO - decrease pool?
            // TODO - batch dom insertions

            vals.forEach(function (val, i) {
                var focusLine = _this2.focusLines[i];
                var pxVal = _this2.xScale(_this2.xDomain[1] * val);
                focusLine.style.visibility = "visible";
                focusLine.setAttribute("x1", pxVal);
                focusLine.setAttribute("x2", pxVal);
            });

            // draw the value of the last focus point
            var lastValEl = this.el.querySelector(".last-val");
            var unitsEl = this.el.querySelector(".units");
            var index = Math.floor(this.data.length * vals.slice(-1)[0]);
            lastValEl.innerHTML = this.getFriendly(this.data[index]);
            unitsEl.innerHTML = this.getMagnitude(this.data[index]) + this.unit;

            // TODO - reevaluate threshold light
            if (this.showLastPoint) {
                var lastPointEl = this.el.querySelector(".sparkline-last-point");
                lastPointEl.style.visibility = "hidden";
            }

            var indicatorEl = this.el.querySelector(".indicator");
            var status = void 0;
            // HACK - this is copy pasta
            if (this.threshold === Infinity) {
                // if no threshold is set
                status = "off";
            } else if (this.data[index] > this.threshold) {
                // if threshold is breached
                status = "on";
            } else {
                // if threshold is safe
                status = "safe";
            }
            indicatorEl.setAttribute("class", "indicator " + status);
        }
    }, {
        key: "blur",
        value: function blur() {
            if (!this.rendered) {
                return;
            }
            this.focusLines.forEach(function (focusLine) {
                focusLine.style.visibility = "hidden";
            });

            // draw the value of the last focus point
            var lastValEl = this.el.querySelector(".last-val");
            var unitsEl = this.el.querySelector(".units");
            lastValEl.innerHTML = this.getFriendly(this.last);
            unitsEl.innerHTML = this.getMagnitude(this.last) + this.unit;

            if (this.showLastPoint) {
                var lastPointEl = this.el.querySelector(".sparkline-last-point");
                lastPointEl.style.visibility = "visible";
            }

            var indicatorEl = this.el.querySelector(".indicator");
            var status = void 0;
            // HACK - this is copy pasta
            if (this.threshold === Infinity) {
                // if no threshold is set
                status = "off";
            } else if (this.last > this.threshold) {
                // if threshold is breached
                status = "on";
            } else {
                // if threshold is safe
                status = "safe";
            }
            indicatorEl.setAttribute("class", "indicator " + status);
        }

        // update the model data and generate new data as
        // needed from the model data. Do not modify the model,
        // and if new data is needed, be sure its actual data
        // and not just view-related stuff (like text formatting)

    }, {
        key: "_update",
        value: function _update(data) {
            if (!data || !data.length) {
                throw new Error("cannot create sparkline from empty data");
            }

            this.data = data || [];
            this.last = data[data.length - 1];
        }

        /*******************
         * rendering and drawing functions are the only place
         * that it is ok to touch the dom!
         */

    }, {
        key: "_render",
        value: function _render() {
            var _this3 = this;

            var p = get(Sparkline.prototype.__proto__ || Object.getPrototypeOf(Sparkline.prototype), "_render", this).call(this);
            p.then(function () {
                _this3.svg = _this3.el.querySelector(".graph");
                return _this3.getBBox(_this3.svg);
            }).then(function (bb) {
                _this3.setScales(bb.width, bb.height);
                _this3.setDrawableArea(bb.width, bb.height);

                _this3.focusLines = [];

                switch (_this3.style) {
                    case "area":
                        _this3.fillSparkline().drawSparkline().drawThreshold();
                        if (_this3.showLastPoint) {
                            _this3.drawLastPoint();
                        }
                        break;
                    case "line":
                        _this3.drawSparkline().drawThreshold();
                        if (_this3.showLastPoint) {
                            _this3.drawLastPoint();
                        }
                        break;
                    case "bar":
                        _this3.drawBars().drawThreshold();
                        break;
                    case "scatter":
                        _this3.drawScatter().drawThreshold();
                        break;
                }
            });
        }

        // sets up x and y scales, with consideration to including
        // padding in the drawable area

    }, {
        key: "setScales",
        value: function setScales(width, height) {
            var dataRange = this.data;

            // if forceThreshold, add it to the dataRange
            // so that min/max will include it
            if (this.forceThreshold) {
                dataRange = dataRange.concat(this.threshold);
            }

            var min = Math.min.apply(Math, dataRange),
                max = Math.max.apply(Math, dataRange);

            this.xDomain = [0, this.data.length - 1];
            // NOTE - min and max are swappped since the 
            // 0,0 origin is upper left (aka going down on
            // y axis is actually incrementing the y value)
            this.yDomain = [max + SPARKLINE_DATA_PADDING, min - SPARKLINE_DATA_PADDING];
            this.xScale = linearScale(this.xDomain, [SPARKLINE_PADDING, width - SPARKLINE_PADDING]);
            this.yScale = linearScale(this.yDomain, [SPARKLINE_PADDING, height - SPARKLINE_PADDING]);
        }

        // creates the bounds of the drawable area of the svg
        // to prevent elements from being clipped off the edges

    }, {
        key: "setDrawableArea",
        value: function setDrawableArea(width, height) {
            if (!this.xScale || !this.yScale) {
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
    }, {
        key: "fillSparkline",
        value: function fillSparkline() {
            this.drawSparkline(true);
            return this;
        }
    }, {
        key: "drawSparkline",
        value: function drawSparkline() {
            var shaded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var svg = this.svg,
                xScale = this.xScale,
                yScale = this.yScale,
                _drawableArea = this.drawableArea,
                x1 = _drawableArea.x1,
                y1 = _drawableArea.y1,
                x2 = _drawableArea.x2,
                y2 = _drawableArea.y2,
                d = [];


            if (shaded) {
                d.push("M" + x1 + "," + y2);
                d.push("L" + x1 + "," + y1);
            } else {
                //d.push(`M${x1},${y2}`);
                d.push("M" + x1 + "," + yScale(this.data[0]));
            }
            this.data.forEach(function (dp, i) {
                d.push("L" + xScale(i) + "," + yScale(dp));
            });
            if (shaded) {
                d.push("L" + x2 + "," + y2);
            }

            svg.appendChild(createSVGNode("path", {
                d: d.join(" "),
                class: "sparkline-path" + (shaded ? " shaded" : "")
            }));
            return this;
        }
    }, {
        key: "drawBars",
        value: function drawBars() {
            var _this4 = this;

            var BAR_PADDING = 2;
            var svg = this.svg,
                xScale = this.xScale,
                yScale = this.yScale,
                _drawableArea2 = this.drawableArea,
                x2 = _drawableArea2.x2,
                y2 = _drawableArea2.y2,
                width = _drawableArea2.width,
                barWidth = width / this.data.length - BAR_PADDING,
                offsetLeft = xScale(0);


            this.data.forEach(function (dp, i) {
                var barDiff = _this4.yScale(dp),
                    barHeight = Math.ceil(y2 - barDiff) || 1;
                svg.appendChild(createSVGNode("rect", {
                    // TODO - dont apply padding to last item
                    x: offsetLeft + (barWidth + BAR_PADDING) * i,
                    y: y2 - barHeight,
                    width: barWidth,
                    height: barHeight,
                    class: "sparkline-bar" + (dp > _this4.threshold ? " bad" : "")
                }));
            });
            return this;
        }
    }, {
        key: "drawScatter",
        value: function drawScatter() {
            var _this5 = this;

            var svg = this.svg,
                xScale = this.xScale,
                yScale = this.yScale,
                _drawableArea3 = this.drawableArea,
                x2 = _drawableArea3.x2,
                y2 = _drawableArea3.y2,
                width = _drawableArea3.width;


            this.data.forEach(function (dp, i) {
                svg.appendChild(createSVGNode("circle", {
                    cx: _this5.xScale(i),
                    cy: _this5.yScale(dp),
                    r: 4,
                    class: "sparkline-scatter" + (dp > _this5.threshold ? " bad" : "")
                }));
            });
            return this;
        }
    }, {
        key: "drawThreshold",
        value: function drawThreshold() {
            if (this.threshold === Infinity) {
                return this;
            }

            var svg = this.svg,
                xScale = this.xScale,
                yScale = this.yScale,
                _drawableArea4 = this.drawableArea,
                x1 = _drawableArea4.x1,
                y1 = _drawableArea4.y1,
                x2 = _drawableArea4.x2,
                y2 = _drawableArea4.y2;

            svg.appendChild(createSVGNode("line", {
                x1: x1,
                y1: yScale(this.threshold),
                x2: x2,
                y2: yScale(this.threshold),
                class: "sparkline-threshold"
            }));
            return this;
        }
    }, {
        key: "drawFocusLine",
        value: function drawFocusLine() {
            var svg = this.svg,
                xScale = this.xScale,
                yScale = this.yScale,
                _drawableArea5 = this.drawableArea,
                x1 = _drawableArea5.x1,
                y1 = _drawableArea5.y1,
                x2 = _drawableArea5.x2,
                y2 = _drawableArea5.y2;

            var focusLineEl = createSVGNode("line", {
                x1: 0,
                y1: y1 - SPARKLINE_PADDING,
                x2: 0,
                y2: y2 + SPARKLINE_PADDING,
                class: "sparkline-focus"
            });
            focusLineEl.style.visibility = "hidden";
            svg.appendChild(focusLineEl);
            this.focusLines.push(focusLineEl);
            return this;
        }
    }, {
        key: "drawLastPoint",
        value: function drawLastPoint() {
            var svg = this.svg,
                xScale = this.xScale,
                yScale = this.yScale,
                x = this.data.length - 1,
                y = this.data[this.data.length - 1];

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

    }, {
        key: "getFriendly",
        value: function getFriendly(val) {
            if (val === null) {
                return "";
            }
            return getFormattedNumber(val)[0];
        }
    }, {
        key: "getMagnitude",
        value: function getMagnitude(val) {
            if (val === null) {
                return "";
            }
            return getFormattedNumber(val)[1];
        }
    }, {
        key: "lastExceedsThreshold",
        value: function lastExceedsThreshold() {
            return this.last > this.threshold;
        }
    }, {
        key: "getIndicatorStatus",
        value: function getIndicatorStatus() {
            if (this.threshold === Infinity) {
                // if no threshold is set
                return "off";
            } else if (this.lastExceedsThreshold()) {
                // if threshold is breached
                return "on";
            } else {
                // if threshold is safe
                return "safe";
            }
        }
    }, {
        key: "getAnnotation",
        value: function getAnnotation() {
            return this.annotation || "";
        }
    }]);
    return Sparkline;
}(QuickVis);

/*global console: true */
var COLOR_PALETTE_LENGTH = 10;

function stackedBarTemplate(vm) {
    return "\n        <div class=\"stacked-wrapper\">\n            <div class=\"name\">" + vm.name + "</div>\n            <div class=\"bars\">\n                " + vm.data.map(function (bar) {
        return barTemplate(vm, bar);
    }).join("") + "\n\n                <!-- empty bar for free space -->\n                " + (vm.free ? barTemplate(vm, { name: "Free", val: vm.free }) : "") + "\n\n                " + (vm.threshold !== Infinity ? "<div class=\"threshold\" style=\"left: " + vm.getThresholdPosition() + "%;\"></div>" : "") + "\n\n            </div>\n            <div class=\"stacked-footer\">\n                " + (vm.originalCapacity ? "\n                    <div class=\"used\">Used: <strong>" + vm.getFormattedNumber(vm.used) + vm.unit + "</strong></div>\n                    <div class=\"free\">Free: <strong>" + vm.getFormattedNumber(vm.free) + vm.unit + "</strong></div>" : "") + "\n                <div class=\"total\">Total: <strong>" + vm.getFormattedNumber(vm.capacity) + vm.unit + "</strong></div>\n            </div>\n        </div>\n\n        <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n    ";
}

function barTemplate(vm, bar) {
    var name = bar.name,
        val = bar.val;

    if (!name) {
        name = "";
    }

    return "\n        <div class=\"bar " + vm.getColorClass(bar) + " " + (name === "Free" ? "free" : "") + "\"\n                style=\"flex: " + val + " 0 0;\"\n                title=\"" + vm.getTitle(name, val) + "\">\n            <div class=\"bar-label\">\n                <!-- this is a hack to cause labels that are\n                    too long to not appear at all. text-overflow\n                    ellipsis is not sufficient here -->\n                &#8203; " + name.replace(" ", "&nbsp;") + "\n            </div>\n        </div>\n    ";
}

var defaultConfig$1 = {
    template: stackedBarTemplate,
    name: "",
    unit: "B",
    threshold: Infinity
};

var StackedBar = function (_QuickVis) {
    inherits(StackedBar, _QuickVis);

    function StackedBar(config) {
        classCallCheck(this, StackedBar);

        config = Object.assign({}, defaultConfig$1, config);

        var _this = possibleConstructorReturn(this, (StackedBar.__proto__ || Object.getPrototypeOf(StackedBar)).call(this, config));

        _this.el.classList.add("stacked-bar");
        _this.name = config.name;
        _this.unit = config.unit;
        _this.originalCapacity = config.capacity;
        _this.originalThreshold = config.threshold;
        return _this;
    }

    createClass(StackedBar, [{
        key: "_update",
        value: function _update(data) {
            if (!data) {
                throw new Error("cannot create stacked bar from empty data");
            }

            this.data = data;
            this.used = this.data.reduce(function (acc, d) {
                return d.val + acc;
            }, 0);

            // set capacity and threshold to
            // original user requested values
            this.capacity = this.originalCapacity;
            this.threshold = this.originalThreshold;

            this.validateCapacity();
            this.validateThreshold();

            var free = this.capacity - this.used;
            this.free = free >= 0 ? free : 0;
        }
    }, {
        key: "validateCapacity",
        value: function validateCapacity() {
            // if no capacity was set, set it
            if (!this.capacity) {
                this.capacity = this.used;
            }

            // if the total used value exceeds capacity, set
            // the capacity to the total used value.
            // aka: raise the roof
            if (this.used > this.capacity) {
                console.warn("StackedBar used (" + getFormattedNumber(this.used).join("") + ") " + "exceeds specified capacity (" + getFormattedNumber(this.capacity).join("") + ") " + "by " + getFormattedNumber(this.used - this.capacity).join(""));
                this.capacity = this.used;
            }
        }
    }, {
        key: "validateThreshold",
        value: function validateThreshold() {
            if (this.threshold === Infinity) {
                // no threshold was set
                return;
            }
            if (this.threshold > this.capacity) {
                console.warn("StackedBar threshold (" + getFormattedNumber(this.threshold).join("") + ") " + "exceeds specified capacity (" + getFormattedNumber(this.capacity).join("") + ") " + "so it is being ignored");
                this.threshold = Infinity;
                return;
            }
        }
    }, {
        key: "getColorClass",
        value: function getColorClass(bar) {
            // empty bar for free space
            if (bar.name === "Free") {
                return "bar-color-none";
            } else {
                // TODO - other color palettes?
                return "bar-color-" + this.getIndexOf(bar) % COLOR_PALETTE_LENGTH;
            }
        }
    }, {
        key: "getIndexOf",
        value: function getIndexOf(bar) {
            return this.data.indexOf(bar);
        }
    }, {
        key: "getFormattedNumber",
        value: function getFormattedNumber$$1(val) {
            if (val === null) {
                return "";
            }
            return getFormattedNumber(val).join("");
        }

        // if a threshold is set and the used exceeds
        // it, return true

    }, {
        key: "exceedsThreshold",
        value: function exceedsThreshold() {
            return !!(this.threshold && this.used > this.threshold);
        }
    }, {
        key: "getIndicatorStatus",
        value: function getIndicatorStatus() {
            if (this.threshold === Infinity) {
                // if no threshold is set
                return "off";
            } else if (this.exceedsThreshold()) {
                // if threshold is breached
                return "on";
            } else {
                // if threshold is safe
                return "safe";
            }
        }

        // get percent position of threshold indicator
        // NOTE - assumes threshold and capacity

    }, {
        key: "getThresholdPosition",
        value: function getThresholdPosition() {
            return this.threshold / this.capacity * 100;
        }
    }, {
        key: "getTitle",
        value: function getTitle(name, val) {
            var formatted = this.getFormattedNumber(val) + this.unit;
            if (name) {
                return name + ": " + formatted;
            } else {
                return formatted;
            }
        }
    }]);
    return StackedBar;
}(QuickVis);

function template$1(vm) {
    return "\n        <div class=\"sparklines\"></div>\n    ";
}

// row based template for sparkline
function rowTemplate(vm) {
    return "\n        <div class=\"metric\">" + vm.metric + "</div>\n        <div class=\"graph-row\"><svg class=\"graph\"></svg></div>\n        <div class=\"last\" style=\"" + (vm.hideLast ? "display:none;" : "") + "\">\n            <!-- NOTE: the html comment after this span is to prevent\n                extra whitespace being added between the 2 elements -->\n            <span class=\"last-val\">" + vm.getFriendly(vm.last) + "</span><!--\n            --><span class=\"units\">" + (vm.getMagnitude(vm.last) + vm.unit) + "</span>\n        </div>\n        <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n    ";
}

var SparklineGrid = function (_QuickVis) {
    inherits(SparklineGrid, _QuickVis);

    function SparklineGrid(config) {
        classCallCheck(this, SparklineGrid);

        var _this = possibleConstructorReturn(this, (SparklineGrid.__proto__ || Object.getPrototypeOf(SparklineGrid)).call(this, config));

        _this.template = template$1;
        _this.el.classList.add("sparkline-grid");
        _this.sparklines = config.sparklines.map(function (c) {
            c.template = rowTemplate;
            // hide all last values if set
            c.hideLast = config.hideLast;
            var sparky = new Sparkline(c);
            return {
                config: c,
                sparkline: sparky
            };
        });
        return _this;
    }

    createClass(SparklineGrid, [{
        key: "focus",
        value: function focus(vals) {
            this.sparklines.forEach(function (s) {
                return s.sparkline.focus(vals);
            });
        }
    }, {
        key: "blur",
        value: function blur() {
            this.sparklines.forEach(function (s) {
                return s.sparkline.blur();
            });
        }
    }, {
        key: "_render",
        value: function _render() {
            var _this2 = this;

            var p = get(SparklineGrid.prototype.__proto__ || Object.getPrototypeOf(SparklineGrid.prototype), "_render", this).call(this);
            p.then(function () {
                var sparklinesEl = _this2.el.querySelector(".sparklines");
                // TODO - detach sparklinesEl first?
                _this2.sparklines.forEach(function (s, i) {
                    sparklinesEl.appendChild(s.sparkline.el);
                    if (_this2.data[i].length) {
                        s.sparkline.render(_this2.data[i]);
                    }
                });
            });
        }
    }]);
    return SparklineGrid;
}(QuickVis);

function template$2(vm) {
    return "\n        <div class=\"bar-grid-bars\"></div>\n    ";
}

// row based template for bar
function rowTemplate$1(vm) {
    return "\n        <div class=\"name\">" + vm.name + "</div>\n        <div class=\"bars-wrap\">\n            <div class=\"bars\">\n                " + vm.data.map(function (bar) {
        return barTemplate(vm, bar);
    }).join("") + "\n\n                <!-- empty bar for free space -->\n                " + (vm.free ? barTemplate(vm, { name: "Free", val: vm.free }) : "") + "\n\n                " + (vm.threshold !== Infinity ? "<div class=\"threshold\" style=\"left: " + vm.getThresholdPosition() + "%;\"></div>" : "") + "\n\n            </div>\n        </div>\n        <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n    ";
}

var BarGrid = function (_QuickVis) {
    inherits(BarGrid, _QuickVis);

    function BarGrid(config) {
        classCallCheck(this, BarGrid);

        var _this = possibleConstructorReturn(this, (BarGrid.__proto__ || Object.getPrototypeOf(BarGrid)).call(this, config));

        _this.template = template$2;
        _this.el.classList.add("bar-grid");
        _this.bars = config.bars.map(function (c) {
            c.template = rowTemplate$1;
            var bar = new StackedBar(c);
            return {
                config: c,
                bar: bar
            };
        });
        return _this;
    }

    createClass(BarGrid, [{
        key: "focus",
        value: function focus(val) {
            this.bars.forEach(function (s) {
                return s.bar.focus(val);
            });
        }
    }, {
        key: "blur",
        value: function blur() {
            this.bars.forEach(function (s) {
                return s.bar.blur();
            });
        }
    }, {
        key: "_render",
        value: function _render() {
            var _this2 = this;

            var p = get(BarGrid.prototype.__proto__ || Object.getPrototypeOf(BarGrid.prototype), "_render", this).call(this);
            p.then(function () {
                var barsEl = _this2.el.querySelector(".bar-grid-bars");
                // TODO - detach barsEl first?
                _this2.bars.forEach(function (s, i) {
                    barsEl.appendChild(s.bar.el);
                    s.bar.render(_this2.data[i]);
                });
            });
        }
    }]);
    return BarGrid;
}(QuickVis);

/*global console: true */
function winLossTemplate(vm) {
    return "\n        <div class=\"name\">" + vm.name + "</div>\n        <div class=\"winlosses\">\n            <div class=\"topsies\">\n                " + vm.data.map(function (dp) {
        return vm.winLoseOrDraw(dp);
    }).map(function (wld) {
        return wld === 1 ? true : false;
    }).map(function (marked) {
        return "<div class=\"winloss-block " + (marked ? "marked" : "") + "\"></div>";
    }).join("") + "\n            </div>\n            <div class=\"bottomsies\">\n                " + vm.data.map(function (dp) {
        return vm.winLoseOrDraw(dp);
    }).map(function (wld) {
        return wld === -1 ? true : false;
    }).map(function (marked) {
        return "<div class=\"winloss-block " + (marked ? "marked" : "") + "\"></div>";
    }).join("") + "\n            </div>\n        </div>\n        <div class=\"win-percent\" " + (vm.hideWinPercent ? 'style="display:none;"' : "") + ">" + vm.getWinPercent() + "</div>\n        <div class=\"indicator " + (vm.lastIsBad() ? "bad" : "") + "\"></div>\n    ";
}

var defaultConfig$2 = {
    template: winLossTemplate,
    name: "",
    hideWinPercent: false,
    tableLayout: false,
    tickCount: 0,
    downsampleFn: downsampleData.MAX
};

var WinLoss = function (_QuickVis) {
    inherits(WinLoss, _QuickVis);

    function WinLoss(config) {
        classCallCheck(this, WinLoss);

        config = Object.assign({}, defaultConfig$2, config);

        var _this = possibleConstructorReturn(this, (WinLoss.__proto__ || Object.getPrototypeOf(WinLoss)).call(this, config));

        _this.el.classList.add("win-loss");
        if (config.tableLayout) {
            _this.el.classList.add("table-layout");
        }
        _this.name = config.name;
        _this.hideWinPercent = config.hideWinPercent;
        _this.tickCount = config.tickCount;
        _this.downsampleFn = config.downsampleFn;
        return _this;
    }

    createClass(WinLoss, [{
        key: "_update",
        value: function _update(data) {
            var _this2 = this;

            if (!data || !data.length) {
                throw new Error("cannot create graph bar from empty data");
            }

            this.data = downsampleData(data, this.tickCount, this.downsampleFn);

            var _data$reduce = this.data.reduce(function (acc, dp) {
                var wld = _this2.winLoseOrDraw(dp);
                // if its a draw, dont increment nothin'
                if (wld === 0) {
                    return acc;
                }

                // increment total
                acc[0] += 1;

                // increment wins
                if (wld === 1) {
                    acc[1]++;
                }
                // increment losses
                if (wld === -1) {
                    acc[2]++;
                }
                return acc;
            }, [0, 0, 0]),
                _data$reduce2 = slicedToArray(_data$reduce, 3),
                total = _data$reduce2[0],
                win = _data$reduce2[1],
                loss = _data$reduce2[2];

            this.winPercent = win / total * 100;
        }
    }, {
        key: "getFormattedNumber",
        value: function getFormattedNumber$$1(val) {
            return getFormattedNumber(val).join("");
        }
    }, {
        key: "getLast",
        value: function getLast() {
            if (this.data) {
                return this.data.slice(-1)[0];
            }
            return null;
        }
    }, {
        key: "lastIsBad",
        value: function lastIsBad() {
            var last = this.getLast();
            if (last || last === null) {
                return false;
            } else {
                return true;
            }
        }
    }, {
        key: "winLoseOrDraw",
        value: function winLoseOrDraw(val) {
            if (val === undefined || val === null) {
                return 0;
            } else if (val) {
                return 1;
            } else {
                return -1;
            }
        }
    }, {
        key: "getWinPercent",
        value: function getWinPercent() {
            return Math.floor(this.winPercent) + "%";
        }
    }, {
        key: "focus",
        value: function focus(vals) {
            var _this3 = this;

            if (this.data) {
                vals.forEach(function (val) {
                    var pos = Math.floor(_this3.data.length * val);
                    _this3.blur();
                    _this3.el.classList.add("focused");
                    _this3.el.querySelector(".topsies .winloss-block:nth-child(" + (pos + 1) + ")").classList.add("focused");
                    _this3.el.querySelector(".bottomsies .winloss-block:nth-child(" + (pos + 1) + ")").classList.add("focused");
                });

                var indicatorEl = this.el.querySelector(".indicator");
                // LOOK im just trying to get this demo out. this code can all
                // burn in hell after this
                var last = this.data[Math.floor(this.data.length * vals.slice(-1)[0])];
                var status = "";
                // HACK - this is copy pasta
                if (!last && last !== null) {
                    status = "bad";
                }
                indicatorEl.setAttribute("class", "indicator " + status);
            }
        }
    }, {
        key: "blur",
        value: function blur() {
            var nodes = this.el.querySelectorAll(".winloss-block.focused");
            var els = Array.prototype.slice.apply(nodes);
            els.forEach(function (el) {
                return el.classList.remove("focused");
            });
            this.el.classList.remove("focused");

            var indicatorEl = this.el.querySelector(".indicator");
            if (indicatorEl) {
                var status = this.lastIsBad() ? "bad" : "";
                indicatorEl.setAttribute("class", "indicator " + status);
            }
        }
    }]);
    return WinLoss;
}(QuickVis);

var quickvis = {
    Sparkline: Sparkline,
    StackedBar: StackedBar,
    SparklineGrid: SparklineGrid,
    BarGrid: BarGrid,
    WinLoss: WinLoss,
    working: working
};

export default quickvis;

//# sourceMappingURL=quickvis-0.1.4-dev.js.map
