/*******************************************************************************
 * SevenSegment
 * @constructor 
 ******************************************************************************/
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
    var d = this.CalcElementDimensions(),
    w = d.Width, h = d.Height,
    sw = this.SegmentWidth * w,
    si = this.SegmentInterval * w,
    bw = this.BevelWidth * sw,
    br = bw / sw,
    ib = (this.SideBevelEnabled)? 1 : 0,
    sf = sw * .8,
    slope = h / w,
    sqrt2 = Math.SQRT2, 
    sqrt3 = Math.sqrt(3);

    // Calculate Points[][] for all 7 segments
    var A = 0, B = 1, C = 2,  D = 3, E = 4, F = 5, G = 6;
    var points = [];   
    points[A] = [
        { x: sw * br * 2 + si / sqrt2,        y: 0            },
        { x: w - sw * br * 2 - si / sqrt2,    y: 0            },
        { x: w - sw * br - si / sqrt2,        y: sw * br      },
        { x: w - sw - si / sqrt2,             y: sw           },
        { x: sw + si / sqrt2,                 y: sw           },
        { x: sw * br + si / sqrt2,            y: sw * br      }
    ];
    
    points[B] = [
        { x: w,               y: sw * br * 2 + si / sqrt2     },
        { x: w,               y: h / 2 - si * .5              },
        { x: w - sw / 2,      y: h / 2 - si * .5              },
        { x: w - sw,          y: h / 2 - sw / 2 - si * .5     },
        { x: w - sw,          y: sw + si / sqrt2              },
        { x: w - sw * br,     y: sw * br + si / sqrt2         }
    ];
    
    points[G] = [
        { x: sw + si / 2 * sqrt3,             y: h / 2 - sw / 2 },
        { x: w - sw - si / 2 * sqrt3,         y: h / 2 - sw / 2 },
        { x: w - sw / 2 - si / 2 * sqrt3,     y: h / 2          },
        { x: w - sw - si / 2 * sqrt3,         y: h / 2 + sw / 2 },
        { x: sw + si / 2 * sqrt3,             y: h / 2 + sw / 2 },
        { x: sw / 2 + si / 2 * sqrt3,         y: h / 2          }
    ];
    
    points[C] = this.FlipVertical(points[B], h);
    points[D] = this.FlipVertical(points[A], h);
    points[E] = this.FlipHorizontal(points[C], w);
    points[F] = this.FlipHorizontal(points[B], w);
    this.Points = points;
}

SevenSegment.prototype.CharacterMasks = (function() {
    return {
    	' ' : parseInt("0000000", 2),
    	''  : parseInt("0000000", 2),
    	'0' : parseInt("0111111", 2),
    	'1' : parseInt("0000110", 2),
    	'2' : parseInt("1011011", 2),
    	'3' : parseInt("1001111", 2),
    	'4' : parseInt("1100110", 2),
    	'5' : parseInt("1101101", 2),
    	'6' : parseInt("1111101", 2),
    	'7' : parseInt("0000111", 2),
    	'8' : parseInt("1111111", 2),
    	'9' : parseInt("1100111", 2),
    	'A' : parseInt("1110111", 2),
    	'B' : parseInt("1111111", 2),
    	'C' : parseInt("0111001", 2),
    	'D' : parseInt("0111111", 2),
    	'E' : parseInt("1111001", 2),
    	'F' : parseInt("1110001", 2),
    	'G' : parseInt("1111101", 2),
    	'H' : parseInt("1110110", 2),
    	'I' : parseInt("0000110", 2),
    	'J' : parseInt("0011110", 2),
    	'K' : parseInt("1110000", 2),
    	'L' : parseInt("0111000", 2),
    	'M' : parseInt("0110111", 2),
    	'N' : parseInt("0110111", 2),
    	'O' : parseInt("0111111", 2),
    	'P' : parseInt("1110011", 2),
    	'Q' : parseInt("0111111", 2),
    	'R' : parseInt("1110111", 2),
    	'S' : parseInt("1101101", 2),
    	'T' : parseInt("0000111", 2),
    	'U' : parseInt("0111110", 2),
    	'V' : parseInt("0111110", 2),
    	'W' : parseInt("0111110", 2),
    	'X' : parseInt("1110000", 2),
    	'Y' : parseInt("1110010", 2),
    	'Z' : parseInt("1011011", 2),
    	'-' : parseInt("1000000", 2)
    };
}());