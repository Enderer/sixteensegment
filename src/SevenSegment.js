function SevenSegment(count, canvas, width, height, x, y) {
    this.X = x || 0;
    this.Y = y || 0;

    this.Width = width || canvas.width;
    this.Height = height || canvas.height;
    
    this.Canvas = canvas;
    this.CalcPoints();
    this.ElementArray.SetCount(count);
}

SevenSegment.prototype = new SegmentCanvas();

SevenSegment.prototype.CalcPoints = function() {
    var d = this.CalcElementDimensions();
    var w = d.Width;
    var h = d.Height;
    var sw = this.SegmentWidth * w;
    var si = this.SegmentInterval * w;
    var bw = this.BevelWidth * sw;
    var br = bw / sw;
    var ib = (this.SideBevelEnabled)? 1 : 0;
    var sf = sw * .8;
    var slope = h / w;

    var sqrt2 = Math.SQRT2;
    var sqrt3 = Math.sqrt(3);

    var p = [];
    this.Points = p;
    for (var i = 0; i < 7; i++) {
        p[i] = [];
        for (var s = 0; s < 6; s++) {
            p[i][s] = { x: 0, y: 0 };
        }
    }

    p[0][0] = { x: sw * br * 2 + si / sqrt2,        y: 0            };
    p[0][1] = { x: w - sw * br * 2 - si / sqrt2,    y: 0            };
    p[0][2] = { x: w - sw * br - si / sqrt2,        y: sw * br      };
    p[0][3] = { x: w - sw - si / sqrt2, 			y: sw           };
    p[0][4] = { x: sw + si / sqrt2,                 y: sw           };
    p[0][5] = { x: sw * br + si / sqrt2,            y: sw * br      };

    p[1][0] = { x: w,               y: sw * br * 2 + si / sqrt2     };
    p[1][1] = { x: w,               y: h / 2 - si * .5              };
    p[1][2] = { x: w - sw / 2,      y: h / 2 - si * .5              };
    p[1][3] = { x: w - sw,          y: h / 2 - sw / 2 - si * .5     };
    p[1][4] = { x: w - sw, 			y: sw + si / sqrt2              };
    p[1][5] = { x: w - sw * br,     y: sw * br + si / sqrt2         };

    p[6][0] = { x: sw + si / 2 * sqrt3, 			y: h / 2 - sw / 2 };
    p[6][1] = { x: w - sw - si / 2 * sqrt3, 		y: h / 2 - sw / 2 };
    p[6][2] = { x: w - sw / 2 - si / 2 * sqrt3, 	y: h / 2 };
    p[6][3] = { x: w - sw - si / 2 * sqrt3, 		y: h / 2 + sw / 2 };
    p[6][4] = { x: sw + si / 2 * sqrt3, 			y: h / 2 + sw / 2 };
    p[6][5] = { x: sw / 2 + si / 2 * sqrt3, 		y: h / 2 };

    p[2] = this.FlipVertical(p[1], h)
    p[3] = this.FlipVertical(p[0], h)
    p[3] = this.FlipVertical(p[0], h)
    p[4] = this.FlipHorizontal(p[2], w)
    p[5] = this.FlipHorizontal(p[1], w)
}

SevenSegment.prototype.CharacterMasks = (function() {
    var charMasks = { };
    charMasks[' '] = parseInt("0000000", 2);
    charMasks['']  = parseInt("0000000", 2);
    charMasks['0'] = parseInt("0111111", 2);
    charMasks['1'] = parseInt("0000110", 2);
    charMasks['2'] = parseInt("1011011", 2);
    charMasks['3'] = parseInt("1001111", 2);
    charMasks['4'] = parseInt("1100110", 2);
    charMasks['5'] = parseInt("1101101", 2);
    charMasks['6'] = parseInt("1111101", 2);
    charMasks['7'] = parseInt("0000111", 2);
    charMasks['8'] = parseInt("1111111", 2);
    charMasks['9'] = parseInt("1100111", 2);
    charMasks['A'] = parseInt("1110111", 2);
    charMasks['B'] = parseInt("1111111", 2);
    charMasks['C'] = parseInt("0111001", 2);
    charMasks['D'] = parseInt("0111111", 2);
    charMasks['E'] = parseInt("1111001", 2);
    charMasks['F'] = parseInt("1110001", 2);
    charMasks['G'] = parseInt("1111101", 2);
    charMasks['H'] = parseInt("1110110", 2);
    charMasks['I'] = parseInt("0000110", 2);
    charMasks['J'] = parseInt("0011110", 2);
    charMasks['K'] = parseInt("1110000", 2);
    charMasks['L'] = parseInt("0111000", 2);
    charMasks['M'] = parseInt("0110111", 2);
    charMasks['N'] = parseInt("0110111", 2);
    charMasks['O'] = parseInt("0111111", 2);
    charMasks['P'] = parseInt("1110011", 2);
    charMasks['Q'] = parseInt("0111111", 2);
    charMasks['R'] = parseInt("1110111", 2);
    charMasks['S'] = parseInt("1101101", 2);
    charMasks['T'] = parseInt("0000111", 2);
    charMasks['U'] = parseInt("0111110", 2);
    charMasks['V'] = parseInt("0111110", 2);
    charMasks['W'] = parseInt("0111110", 2);
    charMasks['X'] = parseInt("1110000", 2);
    charMasks['Y'] = parseInt("1110010", 2);
    charMasks['Z'] = parseInt("1011011", 2);
    charMasks['-'] = parseInt("1000000", 2);
    return charMasks;
})();