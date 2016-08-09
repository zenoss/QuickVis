
(function injectCSS(){
    var style = document.createElement("style");
    style.innerHTML = ".vbox{display:flex;flex-direction:column}.hbox{display:flex;flex-direction:row} .sparkline{color:#555}.sparkline .metric{font-size:1.2em}.sparkline .spark-content{align-items:center}.sparkline .graph{flex:1 1 120px;margin-right:6px;height:2em}.sparkline .graph .sparkline-path{stroke:#555;stroke-width:1;fill:transparent}.sparkline .graph .sparkline-path.shaded{stroke:transparent;fill:#CCC}.sparkline .graph .sparkline-bar{stroke:transparent;fill:#AAA}.sparkline .graph .sparkline-bar.bad{fill:#9C1200}.sparkline .graph .sparkline-scatter,.sparkline .graph .sparkline-last-point{fill:#AAA}.sparkline .graph .sparkline-scatter.bad,.sparkline .graph .sparkline-last-point.bad{fill:#9C1200}.sparkline .graph .sparkline-threshold{stroke:#AAA;stroke-width:2;stroke-dasharray:2, 2;fill:transparent}.sparkline .last{font-size:2em;display:flex;align-items:baseline;line-height:0.7em;letter-spacing:-1px}.sparkline .last-val{margin-right:2px}.sparkline .units{font-size:0.8em;color:#AAA}.sparkline .annotation{font-size:0.9em;color:#AAA;margin-left:2px}.sparkline .indicator:after{display:flex;font-size:1.5em;margin:-5px 5px 0 5px;color:transparent;content:'●'}.sparkline .indicator.on:after{color:#9C1200} .sparkline-grid .sparklines{display:table;width:100%;table-layout:auto}.sparkline-grid .sparkline{display:table-row}.sparkline-grid .sparkline .metric{display:table-cell;font-size:0.8em}.sparkline-grid .sparkline .graph-row{display:table-cell;padding-right:4px}.sparkline-grid .sparkline .graph{width:100%;height:1em;margin:0}.sparkline-grid .sparkline .last{display:table-cell;letter-spacing:0;font-size:1em;text-align:right;white-space:nowrap}.sparkline-grid .sparkline .last-val{font-weight:bold}.sparkline-grid .sparkline .units{font-size:1em;color:#555}.sparkline-grid .sparkline .indicator{display:table-cell;height:1.3em} .stacked-bar{position:relative}.stacked-bar .stacked-wrapper{display:flex;flex-direction:column;color:#555;margin-right:25px}.stacked-bar .name{font-size:1.3em;margin-bottom:2px}.stacked-bar .bars{display:flex;height:30px;position:relative;border:solid #999 1px;background-color:#EEE}.stacked-bar .bars .bar-color-none{background-color:transparent !important}.stacked-bar .bars .bar-color-0{background-color:#6A95A9 !important}.stacked-bar .bars .bar-color-1{background-color:#314F5C !important}.stacked-bar .bars .bar-color-2{background-color:#8F8B3E !important}.stacked-bar .bars .bar-color-3{background-color:#A8A551 !important}.stacked-bar .bars .bar-color-4{background-color:#3A583B !important}.stacked-bar .bars .bar-color-5{background-color:#5CA45E !important}.stacked-bar .bars .bar-color-6{background-color:#8B6A4E !important}.stacked-bar .bars .bar-color-7{background-color:#A48164 !important}.stacked-bar .bars .bar-color-8{background-color:#A44C73 !important}.stacked-bar .bars .bar-color-9{background-color:#572038 !important}.stacked-bar .bars .bar{background-color:#555;color:#EEE;font-weight:bold;font-size:0.9em;cursor:default;overflow:hidden;line-height:30px}.stacked-bar .bar .bar-label{margin:0 4px}.stacked-bar .bars .threshold{position:absolute;left:0;top:-6px;height:40px;background-color:white;border-left:dashed #555 2px}.stacked-bar .stacked-footer{font-size:0.8em;display:flex;padding-top:2px}.stacked-bar .stacked-footer .used,.stacked-bar .stacked-footer .free{margin-right:10px}.stacked-bar .stacked-footer .total{margin-left:auto}.stacked-bar .indicator{font-size:1.8em;position:absolute;bottom:30px;right:0}.stacked-bar .indicator:after{display:flex;color:transparent;content:'●'}.stacked-bar .indicator.on:after{color:#9C1200}";
    document.body.appendChild(style);
    // force layout/paint
    document.querySelector("body").clientWidth;
})();
    

/* QuickVis v0.1.3 */
var quickvis = (function () {
  'use strict';

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
              this._render();
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
              this.el.innerHTML = htmlStr;
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
      var width = arguments.length <= 2 || arguments[2] === undefined ? DEFAULT_MAX_FLOAT_PRECISION : arguments[2];
      var base = arguments.length <= 3 || arguments[3] === undefined ? 1000 : arguments[3];

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
      var targetLength = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_MAX_FLOAT_PRECISION : arguments[1];

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
  function _getFormattedNumber(val) {
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

  // template functions should take a viewmodel and return a string
  // that can be put into the DOM. there should be as little logic in
  // here as possible. Prefer to create viewmodel methods to handle
  // logic.
  function template(vm) {
      return "\n        <div class=\"metric\">" + vm.metric + "</div>\n        <div class=\"hbox spark-content\">\n            <svg class=\"graph\"></svg>\n            <div style=\"display: flex; flex-flow: column nowrap\">\n                <div class=\"last\">\n                    <div class=\"last-val\">" + vm.getFriendly(vm.last) + "</div>\n                    <div class=\"units\">" + (vm.getMagnitude(vm.last) + vm.unit) + "</div>\n                </div>\n                <div class=\"annotation\">" + vm.getAnnotation() + "</div>\n            </div>\n            <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n        </div>\n    ";
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

          config = Object.assign({}, defaultConfig, config);

          var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Sparkline).call(this, config));

          _this.el.classList.add("sparkline");
          _this.metric = config.metric;
          _this.threshold = config.threshold;
          _this.forceThreshold = config.forceThreshold;
          _this.style = config.style;
          _this.unit = config.unit;
          _this.annotation = config.annotation;
          return _this;
      }

      // update the model data and generate new data as
      // needed from the model data. Do not modify the model,
      // and if new data is needed, be sure its actual data
      // and not just view-related stuff (like text formatting)


      createClass(Sparkline, [{
          key: "_update",
          value: function _update(data) {
              if (!data || !data.length) {
                  throw new Error("cannot create sparkline from empty data");
              }

              this.data = data;
              this.last = data[data.length - 1];
          }

          /*******************
           * rendering and drawing functions are the only place
           * that it is ok to touch the dom!
           */

      }, {
          key: "_render",
          value: function _render() {
              get(Object.getPrototypeOf(Sparkline.prototype), "_render", this).call(this);

              this.svg = this.el.querySelector(".graph");
              var bb = this.svg.getBoundingClientRect();
              this.setScales(bb.width, bb.height);
              this.setDrawableArea(bb.width, bb.height);

              switch (this.style) {
                  case "area":
                      this.fillSparkline().drawSparkline().drawThreshold();
                      break;
                  case "line":
                      this.drawSparkline().drawThreshold();
                      break;
                  case "bar":
                      this.drawBars().drawThreshold();
                      break;
                  case "scatter":
                      this.drawScatter().drawThreshold();
                      break;
              }
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
              var shaded = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
              var svg = this.svg;
              var xScale = this.xScale;
              var yScale = this.yScale;
              var _drawableArea = this.drawableArea;
              var x1 = _drawableArea.x1;
              var y1 = _drawableArea.y1;
              var x2 = _drawableArea.x2;
              var y2 = _drawableArea.y2;
              var d = [];

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
              var _this2 = this;

              var BAR_PADDING = 2;
              var svg = this.svg;
              var xScale = this.xScale;
              var yScale = this.yScale;
              var _drawableArea2 = this.drawableArea;
              var x2 = _drawableArea2.x2;
              var y2 = _drawableArea2.y2;
              var width = _drawableArea2.width;
              var barWidth = width / this.data.length - BAR_PADDING;
              var offsetLeft = xScale(0);

              this.data.forEach(function (dp, i) {
                  var barDiff = _this2.yScale(dp),
                      barHeight = Math.ceil(y2 - barDiff) || 1;
                  svg.appendChild(createSVGNode("rect", {
                      // TODO - dont apply padding to last item
                      x: offsetLeft + (barWidth + BAR_PADDING) * i,
                      y: y2 - barHeight,
                      width: barWidth,
                      height: barHeight,
                      class: "sparkline-bar" + (dp > _this2.threshold ? " bad" : "")
                  }));
              });
              return this;
          }
      }, {
          key: "drawScatter",
          value: function drawScatter() {
              var _this3 = this;

              var svg = this.svg;
              var xScale = this.xScale;
              var yScale = this.yScale;
              var _drawableArea3 = this.drawableArea;
              var x2 = _drawableArea3.x2;
              var y2 = _drawableArea3.y2;
              var width = _drawableArea3.width;


              this.data.forEach(function (dp, i) {
                  svg.appendChild(createSVGNode("circle", {
                      cx: _this3.xScale(i),
                      cy: _this3.yScale(dp),
                      r: 4,
                      class: "sparkline-scatter" + (dp > _this3.threshold ? " bad" : "")
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

              var svg = this.svg;
              var xScale = this.xScale;
              var yScale = this.yScale;
              var _drawableArea4 = this.drawableArea;
              var x1 = _drawableArea4.x1;
              var y1 = _drawableArea4.y1;
              var x2 = _drawableArea4.x2;
              var y2 = _drawableArea4.y2;

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
          key: "drawLastPoint",
          value: function drawLastPoint() {
              var svg = this.svg;
              var xScale = this.xScale;
              var yScale = this.yScale;
              var x = this.data.length - 1;
              var y = this.data[this.data.length - 1];
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
              return _getFormattedNumber(val)[0];
          }
      }, {
          key: "getMagnitude",
          value: function getMagnitude(val) {
              return _getFormattedNumber(val)[1];
          }
      }, {
          key: "lastExceedsThreshold",
          value: function lastExceedsThreshold() {
              return this.last > this.threshold;
          }
      }, {
          key: "getIndicatorStatus",
          value: function getIndicatorStatus() {
              return this.lastExceedsThreshold() ? "on" : "off";
          }
      }, {
          key: "getAnnotation",
          value: function getAnnotation() {
              return this.annotation || "";
          }
      }]);
      return Sparkline;
  }(QuickVis);

  var COLOR_PALETTE_LENGTH = 10;

  function stackedBarTemplate(vm) {
      return "\n        <div class=\"stacked-wrapper\">\n            <div class=\"name\">" + vm.name + "</div>\n            <div class=\"bars\">\n                " + vm.data.map(function (bar) {
          return barTemplate(vm, bar);
      }).join("") + "\n\n                <!-- empty bar for free space -->\n                " + (vm.free ? barTemplate(vm, { name: "Free", val: vm.free }) : "") + "\n\n                " + (vm.threshold ? "<div class=\"threshold\" style=\"left: " + vm.getThresholdPosition() + "%;\"></div>" : "") + "\n\n            </div>\n            <div class=\"stacked-footer\">\n                " + (vm.originalCapacity ? "\n                    <div class=\"used\">Used: <strong>" + vm.getFormattedNumber(vm.used) + vm.unit + "</strong></div>\n                    <div class=\"free\">Free: <strong>" + vm.getFormattedNumber(vm.free) + vm.unit + "</strong></div>" : "") + "\n                <div class=\"total\">Total: <strong>" + vm.getFormattedNumber(vm.capacity) + vm.unit + "</strong></div>\n            </div>\n        </div>\n\n        <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n    ";
  }

  function barTemplate(vm, bar) {
      var name = bar.name;
      var val = bar.val;

      if (!name) {
          name = "";
      }

      return "\n        <div class=\"bar " + vm.getColorClass(bar) + "\"\n                style=\"flex: " + val + " 0 0;\"\n                title=\"" + (name ? name + ": " + vm.getFormattedNumber(val) + vm.unit : vm.getFormattedNumber(val) + vm.unit) + "\">\n            <div class=\"bar-label\">\n                <!-- this is a hack to cause labels that are\n                    too long to not appear at all. text-overflow\n                    ellipsis is not sufficient here -->\n                &#8203; " + name.replace(" ", "&nbsp;") + "\n            </div>\n        </div>\n    ";
  }

  var defaultConfig$1 = {
      template: stackedBarTemplate,
      name: "",
      unit: "B",
      threshold: 0
  };

  var StackedBar = function (_QuickVis) {
      inherits(StackedBar, _QuickVis);

      function StackedBar(config) {
          classCallCheck(this, StackedBar);

          config = Object.assign({}, defaultConfig$1, config);

          var _this = possibleConstructorReturn(this, Object.getPrototypeOf(StackedBar).call(this, config));

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
              if (!data || !data.length) {
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
                  console.warn("StackedBar used (" + _getFormattedNumber(this.used).join("") + ") " + "exceeds specified capacity (" + _getFormattedNumber(this.capacity).join("") + ") " + "by " + _getFormattedNumber(this.used - this.capacity).join(""));
                  this.capacity = this.used;
              }
          }
      }, {
          key: "validateThreshold",
          value: function validateThreshold() {
              if (this.threshold > this.capacity) {
                  console.warn("StackedBar threshold (" + _getFormattedNumber(this.threshold).join("") + ") " + "exceeds specified capacity (" + _getFormattedNumber(this.capacity).join("") + ") " + "so it is being ignored");
                  this.threshold = 0;
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
          value: function getFormattedNumber(val) {
              return _getFormattedNumber(val).join("");
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
              return this.exceedsThreshold() ? "on" : "off";
          }

          // get percent position of threshold indicator
          // NOTE - assumes threshold and capacity

      }, {
          key: "getThresholdPosition",
          value: function getThresholdPosition() {
              return this.threshold / this.capacity * 100;
          }
      }]);
      return StackedBar;
  }(QuickVis);

  function template$1(vm) {
      return "\n        <div class=\"sparklines\"></div>\n    ";
  }

  // row based template for sparkline
  function rowTemplate(vm) {
      return "\n        <div class=\"metric\">" + vm.metric + "</div>\n        <div class=\"graph-row\"><svg class=\"graph\"></svg></div>\n        <div class=\"last\">\n            <!-- NOTE: the html comment after this span is to prevent\n                extra whitespace being added between the 2 elements -->\n            <span class=\"last-val\">" + vm.getFriendly(vm.last) + "</span><!--\n            --><span class=\"units\">" + (vm.getMagnitude(vm.last) + vm.unit) + "</span>\n        </div>\n        <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n    ";
  }

  var SparklineGrid = function (_QuickVis) {
      inherits(SparklineGrid, _QuickVis);

      function SparklineGrid(config) {
          classCallCheck(this, SparklineGrid);

          var _this = possibleConstructorReturn(this, Object.getPrototypeOf(SparklineGrid).call(this, config));

          _this.template = template$1;

          _this.el.classList.add("sparkline-grid");
          _this.sparklines = config.sparklines.map(function (c) {
              c.template = rowTemplate;
              var sparky = new Sparkline(c);
              return {
                  config: c,
                  sparkline: sparky
              };
          });
          return _this;
      }

      createClass(SparklineGrid, [{
          key: "_render",
          value: function _render() {
              var _this2 = this;

              get(Object.getPrototypeOf(SparklineGrid.prototype), "_render", this).call(this);
              var sparklinesEl = this.el.querySelector(".sparklines");
              // TODO - detach sparklinesEl first?
              this.sparklines.forEach(function (s, i) {
                  sparklinesEl.appendChild(s.sparkline.el);
                  s.sparkline.render(_this2.data[i]);
              });
          }
      }]);
      return SparklineGrid;
  }(QuickVis);

  var quickvis = {
      Sparkline: Sparkline,
      StackedBar: StackedBar,
      SparklineGrid: SparklineGrid
  };

  return quickvis;

}());

//# sourceMappingURL=quickvis-0.1.3.js.map
