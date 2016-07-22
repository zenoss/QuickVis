
(function injectCSS(){
    var style = document.createElement("style");
    style.innerHTML = ".vbox{display:flex;flex-direction:column}.hbox{display:flex;flex-direction:row} .stacked-bar *{display:flex}.stacked-bar{color:#555}.stacked-bar .stacked-title{align-items:flex-end;margin-bottom:2px}.stacked-bar .stacked-title .name{font-size:1.3em}.stacked-bar .stacked-title .capacity{margin-left:auto;color:#999}.stacked-bar .bars{height:30px;position:relative;border:solid #999 1px;background-color:#EEE;min-width:0}.stacked-bar .bars .bar{align-items:center;background-color:#555;color:#EEE;font-weight:bold;font-size:0.9em;padding-left:3px;overflow:hidden;text-overflow:ellipsis}.stacked-bar .bars .bar.empty{background-color:#EEE} .sparkline{color:#555}.sparkline .metric{font-size:1.2em}.sparkline .spark-content{align-items:center}.sparkline .graph{flex:1 1 120px;margin-right:6px;height:2em}.sparkline .graph .sparkline-path{stroke:#555;stroke-width:1;fill:transparent}.sparkline .graph .sparkline-path.shaded{stroke:transparent;fill:#CCC}.sparkline .graph .sparkline-bar{stroke:transparent;fill:#AAA}.sparkline .graph .sparkline-bar.bad{fill:#9C1200}.sparkline .graph .sparkline-scatter,.sparkline .graph .sparkline-last-point{fill:#AAA}.sparkline .graph .sparkline-scatter.bad,.sparkline .graph .sparkline-last-point.bad{fill:#9C1200}.sparkline .graph .sparkline-threshold{stroke:#AAA;stroke-width:2;stroke-dasharray:2, 2;fill:transparent}.sparkline .last{font-size:2em;display:flex;align-items:baseline;line-height:0.7em;letter-spacing:-1px}.sparkline .last-val{margin-right:2px}.sparkline .units{font-size:0.8em;color:#AAA}.sparkline .annotation{font-size:0.9em;color:#AAA;margin-left:2px}.sparkline .indicator:after{display:flex;font-size:1.5em;margin:-5px 5px 0 5px;color:transparent;content:'●'}.sparkline .indicator.on:after{color:#9C1200}.sparkline.compact .graph{flex:1 1 50px;margin-right:6px;height:1.5em}.sparkline.compact .last{letter-spacing:0;font-size:1.5em}.sparkline.compact .indicator{height:1.4em}.sparkline.row{display:table-row}.sparkline.row .metric{display:table-cell;font-size:0.8em}.sparkline.row .graph-row{display:table-cell}.sparkline.row .graph{width:100%;height:1em}.sparkline.row .last{display:table-cell;letter-spacing:0;font-size:1em;text-align:right;white-space:nowrap}.sparkline.row .last-val{font-weight:bold}.sparkline.row .units{font-size:1em;color:#555}.sparkline.row .indicator{display:table-cell;height:1.3em} .sparkline-grid .sparklines{width:100%;table-layout:auto}";
    document.body.appendChild(style);
    // force layout/paint
    document.querySelector("body").clientWidth;
})();
    

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

      }, {
          key: "_update",
          value: function _update(data) {
              this.data = data;
          }

          // private implementation of render. applies
          // vm to template and replaces html inside of
          // vis's dom el

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

  // template functions should take a viewmodel and return a string
  // that can be put into the DOM. there should be as little logic in
  // here as possible. Prefer to create viewmodel methods to handle
  // logic.
  function fullTemplate(vm) {
      return "\n        <div class=\"metric\">" + vm.metric + "</div>\n        <div class=\"hbox spark-content\">\n            <svg class=\"graph\"></svg>\n            <div style=\"display: flex; flex-flow: column nowrap\">\n                <div class=\"last\">\n                    <div class=\"last-val\">" + vm.getFriendly(vm.last) + "</div>\n                    <div class=\"units\">" + (vm.getMagnitude(vm.last) + vm.unit) + "</div>\n                </div>\n                <div class=\"annotation\">" + vm.getAnnotation() + "</div>\n            </div>\n            <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n        </div>\n    ";
  }

  function compactTemplate(vm) {
      return "\n        <div class=\"metric\">" + vm.metric + "</div>\n        <div class=\"hbox spark-content\">\n            <svg class=\"graph\"></svg>\n            <div class=\"last\">\n                <span class=\"last-val\">" + vm.getFriendly(vm.last) + "</span>\n                <span class=\"units\">" + (vm.getMagnitude(vm.last) + vm.unit) + "</span>\n            </div>\n            <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n        </div>\n    ";
  }

  function rowTemplate(vm) {
      return "\n        <div class=\"metric\">" + vm.metric + "</div>\n        <div class=\"graph-row\"><svg class=\"graph\"></svg></div>\n        <div class=\"last\">\n            <!-- NOTE: the html comment after this span is to prevent\n                extra whitespace being added between the 2 elements -->\n            <span class=\"last-val\">" + vm.getFriendly(vm.last) + "</span><!--\n            --><span class=\"units\">" + (vm.getMagnitude(vm.last) + vm.unit) + "</span>\n        </div>\n        <div class=\"indicator " + vm.getIndicatorStatus() + "\"></div>\n    ";
  }

  var templates = {
      full: fullTemplate,
      compact: compactTemplate,
      row: rowTemplate
  };

  var SPARKLINE_PADDING = 4;
  var SPARKLINE_DATA_PADDING = 1;

  var defaultConfig = {
      metric: "",
      style: "line",
      threshold: Infinity,
      layout: "full",
      template: fullTemplate,
      unit: "B"
  };

  var Sparkline = function (_QuickVis) {
      inherits(Sparkline, _QuickVis);

      // setup configuration related thingies
      function Sparkline(config) {
          classCallCheck(this, Sparkline);

          config = Object.assign({}, defaultConfig, config);

          config.template = templates[config.layout];
          if (!config.template) {
              throw new Error("Invalid sparkline layout '" + config.layout + "'");
          }

          var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Sparkline).call(this, config));

          _this.el.classList.add("sparkline");
          _this.el.classList.add(config.layout);
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
              return getFormattedNumber(val)[0];
          }
      }, {
          key: "getMagnitude",
          value: function getMagnitude(val) {
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

  function stackedBarTemplate(vm) {
      return "\n        <div class=\"hbox stacked-title\">\n            <div class=\"name\">" + vm.name + "</div>\n            <div class=\"capacity\">" + vm.capacity + "TB</div>\n        </div>\n        <div class=\"bars\">\n            " + vm.data.map(function (bar) {
          return barTemplate(vm, bar);
      }).join("") + "\n            <!-- empty bar for free space -->\n            " + barTemplate(vm, { name: "free", val: vm.capacity - vm.getTotal() }) + "\n        </div>\n    ";
  }

  function barTemplate(vm, bar) {
      return "\n        <div class=\"bar\" style=\"flex: " + vm.getRatio(bar.val) + " 0 0; background-color: " + vm.getColor(bar) + ";\"\n        title=\"" + (bar.name + ": " + bar.val) + "\">\n            " + bar.name.replace(" ", "&nbsp;") + "\n        </div>\n    ";
  }

  // TODO - better palette
  var colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

  var StackedBar = function (_QuickVis) {
      inherits(StackedBar, _QuickVis);

      function StackedBar(config) {
          classCallCheck(this, StackedBar);

          config.template = stackedBarTemplate;

          var _this = possibleConstructorReturn(this, Object.getPrototypeOf(StackedBar).call(this, config));

          _this.el.classList.add("stacked-bar");
          _this.name = config.name;
          _this.capacity = config.capacity;
          return _this;
      }

      createClass(StackedBar, [{
          key: "_render",
          value: function _render() {
              get(Object.getPrototypeOf(StackedBar.prototype), "_render", this).call(this);
              this.barsEl = this.el.querySelector(".bars");
          }
      }, {
          key: "getTotal",
          value: function getTotal() {
              return this.data.reduce(function (acc, d) {
                  return acc + d.val;
              }, 0);
          }

          // returns fraction of capacity that val occupies

      }, {
          key: "getRatio",
          value: function getRatio(val) {
              return this.capacity / val;
          }
      }, {
          key: "getColor",
          value: function getColor(bar) {
              // empty bar for free space
              if (bar.name === "free") {
                  return "transparent";
              } else {
                  // TODO - choose colors
                  return colors[this.getIndexOf(bar)];
              }
          }
      }, {
          key: "getIndexOf",
          value: function getIndexOf(bar) {
              return this.data.indexOf(bar);
          }
      }]);
      return StackedBar;
  }(QuickVis);

  function template(vm) {
      return "\n        <table class=\"sparklines\"></table>\n    ";
  }

  var SparklineGrid = function (_QuickVis) {
      inherits(SparklineGrid, _QuickVis);

      function SparklineGrid(config) {
          classCallCheck(this, SparklineGrid);

          var _this = possibleConstructorReturn(this, Object.getPrototypeOf(SparklineGrid).call(this, config));

          _this.template = template;

          _this.el.classList.add("sparkline-grid");
          _this.sparklines = config.sparklines.map(function (c) {
              // TODO - reevaluate config object
              c.config.layout = "row";
              var sparky = new Sparkline(c.config);
              return {
                  config: c.config,
                  vals: c.vals,
                  sparkline: sparky
              };
          });
          return _this;
      }

      createClass(SparklineGrid, [{
          key: "_render",
          value: function _render() {
              get(Object.getPrototypeOf(SparklineGrid.prototype), "_render", this).call(this);
              var sparklinesEl = this.el.querySelector(".sparklines");
              // TODO - detach sparklinesEl first?
              this.sparklines.forEach(function (s) {
                  sparklinesEl.appendChild(s.sparkline.el);
                  s.sparkline.render(s.vals);
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

//# sourceMappingURL=quickvis-0.1.1-dev.js.map
