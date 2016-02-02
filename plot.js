"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//import {d3} from "d3";

var ZoomCoordinates = (function () {
  function ZoomCoordinates(minx, maxx, miny, maxy) {
    _classCallCheck(this, ZoomCoordinates);

    this.minX = minx;
    this.minY = miny;
    this.maxX = maxx;
    this.maxY = maxy;
  }

  _createClass(ZoomCoordinates, [{
    key: "toString",
    value: function toString() {
      return "X( " + this.minX + " , " + this.maxX + " ) Y( " + this.minY + " , " + this.maxY + " )";
    }
  }]);

  return ZoomCoordinates;
})();

var Series = (function () {
  function Series(plot, ydata) {
    var _this = this;

    var xdata = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    _classCallCheck(this, Series);

    this.plot = plot;
    this.xData = xdata;
    this.yData = ydata;
    this.maxX = -Number.MAX_VALUE;
    this.maxY = -Number.MAX_VALUE;
    this.minX = Number.MAX_VALUE;
    this.minY = Number.MAX_VALUE;
    this.tag = "";
    this.connect = true;
    this.dataColor = "#ff0000";

    var cnt = 0;
    if (xdata.length === 0) {
      this.yData.forEach(function (f) {
        _this.xData.push(cnt);
        cnt++;
      });
      // xdata.forEach(f => {
      //   console.log(f);
      // });
    }
  }

  _createClass(Series, [{
    key: "findYMaxMin",
    value: function findYMaxMin() {
      var _this2 = this;

      this.maxY = -Number.MAX_VALUE;
      this.minY = Number.MAX_VALUE;
      this.yData.forEach(function (f) {
        var point = f;
        if (point > _this2.maxY) {
          _this2.maxY = point;
        }
        if (point < _this2.minY) {
          _this2.minY = point;
        }
      });
      if (this.maxY > this.plot.yAxisMax) {
        if (this.maxY > 0) {
          this.plot.yAxisMax = this.maxY + this.maxY * 0.1;
        } else {
          this.plot.yAxisMax = this.maxY - this.maxY * 0.1;
        }
      }
      if (this.minY < this.plot.yAxisMin) {
        if (this.minY > 0) {
          this.plot.yAxisMin = this.minY - this.minY * 0.1;
        } else {
          this.plot.yAxisMin = this.minY + this.minY * 0.1;
        }
      }
    }
  }, {
    key: "findXMaxMin",
    value: function findXMaxMin() {
      var _this3 = this;

      this.maxX = -Number.MAX_VALUE;
      this.minX = Number.MAX_VALUE;
      this.xData.forEach(function (f) {
        var point = f;
        if (point > _this3.maxX) {
          _this3.maxX = point;
        }
        if (point < _this3.minX) {
          _this3.minX = point;
        }
      });
      if (this.maxX > this.plot.xAxisMax) {
        if (this.maxX > 0) {
          this.plot.xAxisMax = this.maxX + this.maxX * 0.1;
        } else {
          this.plot.xAxisMax = this.maxX - this.maxX * 0.1;
        }
      }
      if (this.minX < this.plot.xAxisMin) {
        if (this.minX > 0) {
          this.plot.xAxisMin = this.minX - this.minX * 0.1;
        } else {
          this.plot.xAxisMin = this.minX + this.minX * 0.1;
        }
      }
    }
  }, {
    key: "drawPoints",
    value: function drawPoints() {
      var startx = 1;
      var ctx = this.plot.ctx;
      var endx = this.yData.length;
      if (this.yData.length < 1) {
        return;
      }
      var start = this.plot.getPoint(this.xData[0], this.yData[0]);
      //ctx.fillStyle = this.dataColor;
      ctx.strokeStyle = this.dataColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);

      for (var cnt = startx; cnt < endx; cnt++) {
        var p = this.plot.getPoint(this.xData[cnt], this.yData[cnt]);
        if (this.connect) {
          //console.log("Drawing a line to x: " + p.x + " y: " + p.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          ctx.fillRect(p.x, p.y, 1, 1);
        }
      }
      ctx.closePath();
    }

    // drawTag() {
    //           if (tag != null && !tag.isEmpty()) {
    //               legendCtr++;
    //               bufferGraphics.setColor(dataColor);
    //               bufferGraphics.drawString(tag, ((15 * legendCtr) / height) * 80, (15 * legendCtr) % height);
    //           }
    // }

  }]);

  return Series;
})();

var Point = (function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: "toString",
    value: function toString() {
      var xs = this.x.toFixed(2);
      var ys = this.y.toFixed(2);
      return "(" + xs + "," + ys + ")";
    }
  }]);

  return Point;
})();

var Plot = (function () {
  function Plot(id) {
    _classCallCheck(this, Plot);

    this.xAxisMin = Number.MAX_VALUE;
    this.yAxisMin = Number.MAX_VALUE;
    this.xAxisMax = -Number.MAX_VALUE;
    this.yAxisMax = -Number.MAX_VALUE;
    this.numVGrids = 4;
    this.numHGrids = 4;
    this.drawVGridB = true;
    this.drawHGridB = true;
    this.drawHAxisB = true;
    this.drawVAxisB = true;
    this.drawHLegend = true;
    this.drawVLegend = true;
    this.xLegendIsTime = false;
    this.legendCtr = 0;
    // private boolean updateLock = false;
    //    this.bgroundColor = "#ff1a8c";
    this.bgroundColor = "#ffffff";
    this.selectionColor = "#ffff00";
    this.axisColor = "#000000";
    this.gridColor = "#808080";
    this.series = [];

    this.selectionStart = null;
    this.selectionEnd = null;

    this.highLight = true;

    var element = document.createElement('canvas');
    element.id = id;
    document.body.appendChild(element);
    //    element.onmousemove = this.formMouseMoved;
    var that = this;
    element.onmousemove = function (evt) {
      that.doMouseMoved(evt);
    };
    element.height = 600;
    element.width = 800;
    this.element = element;

    //Put it in a div
    var holder = document.createElement('div');
    holder.setAttribute("style", "position:absolute; top:120px; left:20px;");
    holder.id = id + '_holder';
    holder.appendChild(element);
    document.body.appendChild(holder);
    this.holder = holder;
    //document.getElementById('someBox').appendChild(canv);

    //    this.element = document.getElementById(id);
    this.width = element.width;
    this.height = element.height;
    console.log("New plot was made using canvas id " + id + " width " + this.width + " height " + this.height);
    this.ctx = element.getContext("2d");
    this.imageData = this.ctx.createImageData(element.width, element.height);
    this.drawBackground();
  }

  _createClass(Plot, [{
    key: "getMousePos",
    value: function getMousePos(evt) {
      var rect = this.element.getBoundingClientRect();
      return new Point(evt.clientX - rect.left, evt.clientY - rect.top);
    }
  }, {
    key: "setToolTip",
    value: function setToolTip(pos, val) {
      var ctx = this.ctx;
      //this.drawBackground();

      ctx.putImageData(this.backImage, 0, 0); // at coords 0,0
      var end = val.toString().length * 7 + 4;
      ctx.fillStyle = this.selectionColor;
      ctx.strokeStyle = "#000000";
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y - 20);
      ctx.lineTo(pos.x + end, pos.y - 20);
      ctx.lineTo(pos.x + end, pos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.font = "12px Georgia";
      ctx.fillStyle = this.axisColor;
      ctx.fillText(val.toString(), pos.x + 4, pos.y - 5);
    }
  }, {
    key: "doMouseMoved",
    value: function doMouseMoved(evt) {
      if (this.highLight) {
        var pos = this.getMousePos(evt);
        var pval = this.getPValue(pos.x, pos.y);
        this.setToolTip(pos, pval);
      }
    }
  }, {
    key: "setZoom",
    value: function setZoom(zoom) {
      this.yAxisMin = zoom.minY;
      this.yAxisMax = zoom.maxY;
      this.xAxisMin = zoom.minX;
      this.xAxisMax = zoom.maxX;
    }
  }, {
    key: "getZoom",
    value: function getZoom() {
      var ret = new ZoomCoordinates(this.xAxisMin, this.xAxisMax, this.yAxisMin, this.yAxisMax);
      return ret;
    }
  }, {
    key: "drawVGrid",
    value: function drawVGrid() {
      var interval = this.width / (this.numVGrids + 1.0);
      var ctx = this.ctx;
      for (var cnt = 0; cnt < this.numVGrids; cnt++) {
        var mid = (cnt + 1) * interval;
        ctx.moveTo(mid, 0);
        ctx.lineTo(mid, this.height);
        ctx.stroke();
      }
    }
  }, {
    key: "drawVAxisTicks",
    value: function drawVAxisTicks() {
      var ctx = this.ctx;
      var interval = this.height / (this.numHGrids + 1.0);
      var w = this.width / 2;
      for (var cnt = 0; cnt < this.numHGrids; cnt++) {
        var mid = (cnt + 1) * interval;
        ctx.moveTo(w - 4, mid);
        ctx.lineTo(w + 4, mid);
        ctx.stroke();
      }
    }
  }, {
    key: "drawHAxisTicks",
    value: function drawHAxisTicks() {
      var ctx = this.ctx;
      var interval = this.width / (this.numVGrids + 1.0);
      var h = this.height / 2;
      for (var cnt = 0; cnt < this.numVGrids; cnt++) {
        var mid = (cnt + 1) * interval;
        ctx.moveTo(mid, h - 4);
        ctx.lineTo(mid, h + 4);
        ctx.stroke();
      }
    }
  }, {
    key: "drawHGrid",
    value: function drawHGrid() {
      var interval = this.height / (this.numHGrids + 1.0);
      var ctx = this.ctx;
      for (var cnt = 0; cnt < this.numHGrids; cnt++) {
        var mid = (cnt + 1) * interval;
        ctx.moveTo(0, mid);
        ctx.lineTo(this.width, mid);
        ctx.stroke();
      }
    }
  }, {
    key: "drawHLabels",
    value: function drawHLabels() {
      var ctx = this.ctx;
      var interval = this.height / (this.numHGrids + 1.0);
      var valueInterval = (this.yAxisMax - this.yAxisMin) / (this.numHGrids + 1.0);
      for (var cnt = 0; cnt <= this.numHGrids; cnt++) {
        var mid = cnt * interval;
        var value = this.yAxisMax - cnt * valueInterval;
        var displayString = value.toFixed(2);
        ctx.font = "10px Georgia";
        ctx.fillStyle = this.axisColor;
        ctx.fillText(displayString, this.width - 3.0 * displayString.length, mid);
      }
    }
  }, {
    key: "drawVLabels",
    value: function drawVLabels() {
      var ctx = this.ctx;
      var interval = this.width / (this.numVGrids + 1.0);
      var valueInterval = (this.xAxisMax - this.xAxisMin) / (this.numVGrids + 1.0);
      for (var cnt = 0; cnt <= this.numVGrids; cnt++) {
        var mid = cnt * interval;
        var value = this.xAxisMin + cnt * valueInterval;
        var displayString = value.toFixed(2);
        ctx.font = "10px Georgia";
        ctx.fillStyle = this.axisColor;
        ctx.fillText(displayString, mid, this.height - 5);
      }
    }
  }, {
    key: "drawHAxis",
    value: function drawHAxis() {
      var ctx = this.ctx;
      var h = this.height / 2;
      ctx.moveTo(0, h);
      ctx.lineTo(this.width, h);
      ctx.stroke();
    }
  }, {
    key: "drawVAxis",
    value: function drawVAxis() {
      var ctx = this.ctx;
      var w = this.width / 2;
      ctx.moveTo(w, 0);
      ctx.lineTo(w, this.height);
      ctx.stroke();
    }
  }, {
    key: "addData",
    value: function addData(data) {
      var color = arguments.length <= 1 || arguments[1] === undefined ? "#0000ff" : arguments[1];
      var autoscale = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
      var connectLines = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
      var tag = arguments.length <= 4 || arguments[4] === undefined ? "" : arguments[4];

      var s = new Series(this, data.y, data.x);
      if (autoscale) {
        s.findXMaxMin();
        s.findYMaxMin();
      }
      s.dataColor = color;
      s.connect = connectLines;
      s.tag = tag;
      this.series.push(s);
      this.drawBackground();
    }
  }, {
    key: "clearData",
    value: function clearData() {
      this.series.splice(0, this.series.length);
      this.legendCtr = 0;
      this.drawBackground();
    }
  }, {
    key: "getPoint",
    value: function getPoint(x, y) {
      var w = (x - this.xAxisMin) / (this.xAxisMax - this.xAxisMin) * this.width;
      var h = (1.0 - (y - this.yAxisMin) / (this.yAxisMax - this.yAxisMin)) * this.height;
      return new Point(w, h);
      //return {"x" : w, "y" : h, toString(){return "X: " + this.x + " Y: " + this.y;}};
    }
  }, {
    key: "getPValue",
    value: function getPValue(x, y) {
      var w = x / this.width * (this.xAxisMax - this.xAxisMin) + this.xAxisMin;
      var h = (1 - y / this.height) * (this.yAxisMax - this.yAxisMin) + this.yAxisMin;
      return new Point(w, h);
      //return {"w" : w, "h" : h, toString(){return "W: " + this.w + " H: " + this.h;}};
    }
  }, {
    key: "drawSelection",
    value: function drawSelection() {
      if (this.selectionStart != null && this.selectionEnd != null) {
        var ctx = this.ctx;
        var start = selectionStart;
        var end = selectionEnd;
        ctx.fillStyle = this.selectionColor;
        ctx.strokeStyle = "#000000";
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.moveTo(start.x, end.y);
        ctx.moveTo(end.x, end.y);
        ctx.moveTo(end.x, start.y);
        ctx.moveTo(start.x, start.y);
        //      ctx.stroke();
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }
  }, {
    key: "drawBackground",
    value: function drawBackground() {
      var ctx = this.ctx;
      ctx.fillStyle = this.bgroundColor;
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.strokeStyle = this.axisColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (this.drawHAxisB) {
        this.drawHAxis();
        this.drawHAxisTicks();
      }
      if (this.drawVAxisB) {
        this.drawVAxis();
        this.drawVAxisTicks();
      }
      ctx.closePath();
      var pattern = [];
      pattern.push(1);
      pattern.push(4);
      ctx.strokeStyle = this.gridColor;
      ctx.setLineDash(pattern);
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (this.drawHGridB) {
        this.drawHGrid();
      }
      if (this.drawVGridB) {
        this.drawVGrid();
      }
      ctx.closePath();
      ctx.setLineDash([]);
      if (this.drawHLegend) {
        this.drawHLabels();
      }
      if (this.drawVLegend) {
        this.drawVLabels();
      }
      this.series.forEach(function (f) {
        f.drawPoints();
      });
      this.legendCtr = 0;
      this.drawSelection();
      this.backImage = ctx.getImageData(0, 0, this.width, this.height);
    }
  }, {
    key: "setPixel",
    value: function setPixel(x, y, r, g, b, a) {
      var imageData = this.imageData;
      var index = (x + y * imageData.width) * 4;
      imageData.data[index + 0] = r;
      imageData.data[index + 1] = g;
      imageData.data[index + 2] = b;
      imageData.data[index + 3] = a;
    }
  }, {
    key: "drawRandom",
    value: function drawRandom() {
      //var length = this.width * this.height;
      // draw random dots
      for (var cnt = 0; cnt < 10000; cnt++) {
        var x = Math.random() * this.width | 0; // |0 to truncate to Int32
        var y = Math.random() * this.height | 0;
        var r = Math.random() * 256 | 0;
        var g = Math.random() * 256 | 0;
        var b = Math.random() * 256 | 0;
        this.setPixel(x, y, r, g, b, 255); // 255 opaque
      }

      // copy the image data back onto the canvas
      this.ctx.putImageData(this.imageData, 0, 0); // at coords 0,0
    }
  }]);

  return Plot;
})();
