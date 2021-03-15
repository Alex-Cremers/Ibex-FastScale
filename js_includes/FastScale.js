(function () {

function norm256(x) {
    if (x < 0)
        return 0;
    else if (x > 255)
        return 255;
    return x;
}

function rgbToS(col) {
    function pad0(s) {
        if (s.length == 1)
            s = '0' + s;
        return s;
    }

    var cols = '#';
    cols += pad0(col[0].toString(16));
    cols += pad0(col[1].toString(16));
    cols += pad0(col[2].toString(16));

    return cols;
}

function parseColor(col) {
    var m;
    if ($.isArray(col)) {
        return col;
    }
    else if (typeof(col) == 'string') {
        if (col.length > 0 && col[0] == '#') {
            var r,g,b;
            if (col.length == 7) {
                r = parseInt(col.substr(1,2), 16);
                g = parseInt(col.substr(3,2), 16);
                b = parseInt(col.substr(5,2), 16);
                if (isNaN(r) || isNaN(g) || isNaN(b))
                    assert(false, "Could not parse color '" + col + "'");
                return [r,g,b];
            }
            else if (col.length == 4) {
                r = parseInt(col.substr(1,1), 16);
                g = parseInt(col.substr(1,1), 16);
                b = parseInt(col.substr(1,1), 16)
                if (isNaN(r) || isNaN(g) || isNaN(b))
                    assert(false, "Could not parse color '" + col + "'");
                return [r,g,b];
            }
            else {
                assert(false, "Could not parse color '" + col + "'");
            }
        }
        else if (m = col.match(/\s*rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\)\s*/)) {
            var r = parseFloat(m[1]);
            var g = parseFloat(m[2]);
            var b = parseFloat(m[3]);
            if (isNaN(r) || isNaN(g) || isNaN(b))
                assert(false, "Could not parse color '" + col + "'");
            r = parseInt(Math.round(r * 256.0));
            g = parseInt(Math.round(g * 256.0));
            b = parseInt(Math.round(b * 256.0));
            r = norm256(r);
            g = norm256(g);
            b = norm256(b);
            return [r,g,b];
        }
        else {
            // Support standard HTML color names.
            var map = {
                red: [255,0,0],
                green: [0,255,0],
                blue: [0,0,255],
                aqua: [0,255,255],
                black: [0,0,0],
                fuchsia: [255,0,255],
                gray: [128,128,128],
                lime: [0,255,0],
                maroon: [128,0,0],
                navy: [0,0,128],
                olive: [128,128,0],
                orange: [256,165,0],
                purple: [128,0,128],
                silver: [192,192,192],
                teal: [0, 128,128],
                white: [255,255,255],
                yellow: [255,255,0]
            };
            var u = col.toLowerCase();
            if (map[u])
                return map[u];
            assert(false, "Could not parse color '" + col + "'");
        }
    }
    else {
        assert(false, "Could not parse color '" + col + "'");
    }
}

define_ibex_controller({
name: "FastScale",

jqueryWidget: {
    _init: function () {
        var self = this;
      
      
        this.utils = this.options._utils;
console.log(this.utils.getValuesFromPreviousElement());

        this.cssPrefix = this.options._cssPrefix;
        this.finishedCallback = this.options._finishedCallback;

        this.html = this.options.html;
        this.decimalPlaces = (this.options.decimalPlaces == null ? 0 : this.options.decimalPlaces);
        this.startColor = this.options.startColor ? parseColor(this.options.startColor) : parseColor("#5947FD");
        this.endColor = this.options.endColor ? parseColor(this.options.endColor) : parseColor("#59BAFD");

        this.startValue = this.options.startValue||0;
        assert(typeof(this.startValue) == "number", "'startValue' option must be a number");
        this.endValue = this.options.endValue||100;
        assert(typeof(this.endValue) == "number", "'endValue' option must be a number");
      
        this.scaleLabels = this.options.scaleLabels;
        
        if(this.scaleLabels){
          assert(this.scaleLabels == "numeric"||(Array.isArray(this.scaleLabels)&&this.scaleLabels.length>=2), "'scaleLabels' option must be null, the string 'numeric', or an array of length 2 giving the left and right labels as strings.");
          this.leftLabel = (this.scaleLabels=="numeric" ? this.startValue.toFixed(this.decimalPlaces) : this.scaleLabels[0]);
          this.rightLabel = (this.scaleLabels=="numeric" ? this.endValue.toFixed(this.decimalPlaces) : this.scaleLabels[1]);
        }
      
        this.setFlag = function(currentFraction) {
          this.utils.setValueForNextElement("previousFraction", currentFraction);
        }
        
        this.$html = htmlCodeToDOM(this.html);
        this.element.append($("<div>").addClass(this.cssPrefix + 'html').append(this.$html));

        this.currentMousePos = { x: 0, y: 0};

        var $bar = $("<div>").addClass(this.cssPrefix + 'bar');
        var $handle = $("<div>").addClass(this.cssPrefix + 'handle');
        var $handleLabel = $("<div>").addClass(this.cssPrefix + 'handle-label');
        var $leftLabel = $("<div>").addClass(this.cssPrefix + 'scale-label');
        var $rightLabel = $("<div>").addClass(this.cssPrefix + 'scale-label');
        this.$bar = $bar;
        this.$handle = $handle;
        this.$handleLabel = $handleLabel;
        this.$leftLabel = $leftLabel;
        this.$rightLabel = $rightLabel;

        this.scaleWidth = this.options.scaleWidth || 300;
        this.scaleHeight = this.options.scaleHeight || 20;
        this.handleWidth = this.options.handleWidth || 30;
        this.handleHeight = this.options.handleHeight || 30;
        this.scaleWidth = parseInt(this.scaleWidth);
        this.scaleHeight = parseInt(this.scaleHeight);
        this.handleWidth = parseInt(this.handleWidth);
        this.handleHeight = parseInt(this.handleHeight);
        $bar.css('width', this.scaleWidth + 'px');
        $bar.css('height', this.scaleHeight + 'px');
        $handle.css({ width: this.handleWidth + 'px',
                      height: this.handleHeight + 'px' });

        $bar.append($handle);
        if (this.options.handleLabel) {
          $bar.append($handleLabel);
        }
        if (this.options.scaleLabels) {
            $bar.append($leftLabel);
            $bar.append($rightLabel);
            this.$leftLabel.text(this.leftLabel);
            this.$rightLabel.text(this.rightLabel);
        }
        this.element.append($bar);
      
        this.handleLeft = parseInt(this.scaleWidth / 2);
      this.fraction = this.utils.getValueFromPreviousElement("previousFraction") || 0.5;
        t();
        function t() {
            self.setHandlePos();
            self.utils.setTimeout(t, 100);
        }
        $handle.css('background', rgbToS(this.getHandleColor()));
        this.setLinearGradient($bar, this.startColor, this.endColor);
        this.setupFollowMouse();
        this.safeBind($(window), 'resize', function (e) {
            self.setHandlePos();
        });
    },
    getBarO: function () {
        var barO = this.$bar.offset();
        var barLeft = barO.left;
        var barTop = barO.top;
        //barLeft += $(window).scrollLeft();
        //barTop += $(window).scrollTop();
        return { top: barTop, left: barLeft };
    },
    forceFraction: function (x) {
        this.fraction = x;
    },

    setHandlePos: function () {
        var x = this.fraction * this.scaleWidth;
        var barO = this.getBarO();
        var barLeft = barO.left;
        var barTop = barO.top;
        //barLeft += $(window).scrollLeft();
        //barTop += $(window).scrollTop();
        var hleft = (barLeft + parseInt(x) - parseInt(Math.round(this.handleWidth/2)));
        var htop = (barTop - parseInt(Math.round((this.handleHeight - this.scaleHeight)/2.0)));
        this.$handle.css('left', hleft + 'px');
        this.$handle.css('top', htop + 'px');
        var handleLableText = (this.fraction * (this.endValue - this.startValue)) + this.startValue;
        if (this.options.handleLabel) {
          this.$handleLabel.text(handleLableText.toFixed(this.decimalPlaces));
        }
        this.$handleLabel.css('left', parseInt(hleft + this.handleWidth/2 - this.$handleLabel.width()/2) + 'px');
        this.$handleLabel.css('top', parseInt(htop - this.handleHeight) + 'px');
        // Set color for handle.
        var col = this.getHandleColor();
        this.$handle.css('background', rgbToS(col));

        if (this.options.scaleLabels) {
            this.$leftLabel.css('left', parseInt(barLeft - this.$leftLabel.width()/2) + 'px');
            this.$leftLabel.css('top', (barTop + this.handleHeight) + 'px');
            this.$rightLabel.css('left', parseInt(barLeft + this.scaleWidth - this.$rightLabel.width()/2) + 'px');
            this.$rightLabel.css('top', (barTop + this.handleHeight) + 'px');
        }
    },

    getHandleColor: function () {
        var self = this;
        var frac = this.fraction;
        var rd = parseInt(Math.round(frac * (self.endColor[0] - self.startColor[0])));
        var gd = parseInt(Math.round(frac * (self.endColor[1] - self.startColor[1])));
        var bd = parseInt(Math.round(frac * (self.endColor[2] - self.startColor[2])));
        var r = self.startColor[0] + rd;
        var g = self.startColor[1] + gd;
        var b = self.startColor[2] + bd;
        r = norm256(r);
        g = norm256(g);
        b = norm256(b);
        return [r,g,b];
    },

    handleMouseClick: function () {
        var val = (this.fraction * (this.endValue - this.startValue)) + this.startValue;
        console.log("VAL", val);
        this.setFlag(this.fraction);
        this.finishedCallback([[
            ["html", csv_url_encode(this.$html.innerHTML)],
            ["startValue", this.startValue.toFixed(this.decimalPlaces)],
            ["endValue", this.endValue.toFixed(this.decimalPlaces)],
            ["value", val.toFixed(this.decimalPlaces)]
        ]]);
    },
    setupFollowMouse: function () {
        var self = this;
        self.safeBind($(document), 'mousemove', function (e) {
          self.currentMousePos.x = e.pageX;
          var value = (self.currentMousePos.x - self.$bar.offset().left) / self.scaleWidth * 100;
          value = value > 100? 100: value
          value = value < 0? 0: value
          self.forceFraction(value/100);
          self.setHandlePos();
          
        });

        self.safeBind($(document), 'mousedown', function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.handleMouseClick(e)
        });
    },

    setLinearGradient: function ($elem, startColor, endColor) {
        var scol = rgbToS(startColor);
        var ecol = rgbToS(endColor);

        $elem.css('filter', "progid:DXImageTransform.Microsoft.Gradient(startColorstr='" + scol + "', endColorstr='" + ecol + "', GradientType=1)");
        $elem.css('background-image', '-ms-linear-gradient(left,' + scol + ' 0%, ' + ecol + ' 100%)');
        $elem.css('background-image', '-webkit-gradient(linear, left rop, right top, color-stop(0, ' + scol + '), color-stop(1,' + ecol + '))');
        $elem.css('background-image', '-webkit-linear-gradient(left, ' + scol + ' 0%,' + ecol + ' 100%)');
        $elem.css('background-image', '-o-linear-gradient(left, ' + scol + ',' + ecol + ')');
        $elem.css('background-image', '-moz-linear-gradient(left, ' + scol + ',' + ecol + ')');
        $elem.css('background-image', 'linear-gradient(to right' + scol + ',' + ecol + ')');
    }
},

properties: {
    obligatory: ["html"],
    htmlDescription: function(opts) {
        return $(document.createElement("div")).text(opts.s || "");
    }
}
});

})();
