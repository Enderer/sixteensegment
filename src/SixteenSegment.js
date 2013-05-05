/*******************************************************************************
 * SixteenSegment
 * @constructor 
 * Implements Points[] and CharacterMasks[] for a sixteen segment display 
 ******************************************************************************/
function SixteenSegment(count, canvas, width, height, x, y) {
    "use strict";
    // Set the starting position on the canvas. Default is (0,0)
    this.X = x || 0;
    this.Y = y || 0;

    // Set display size. Defaults to the size of the canvas
    this.Width = width || canvas.width;
    this.Height = height || canvas.height;

    this.Canvas = canvas;
    this.CalcPoints();
    this.SetCount(count);
}

// Implements SegmentCanvas using Points[][] and CharacterMasks[] for 16 segments
SixteenSegment.prototype = new SegmentCanvas();

// Calculates the point positions for each segment & stores them in Points[][].
// Ex. The first point for the second segment is stored at Points[1][0];
// Segments are labeled a1, a2, b, c, d1, d2, e, f, g1, g2, h, i, j, k, l, m
SixteenSegment.prototype.CalcPoints = function() {
    "use strict";
    var d = this.CalcElementDimensions(),
        w = d.Width,
        h = d.Height,
        sw = this.SegmentWidth * w,
        si = this.SegmentInterval * w,
        bw = this.BevelWidth * sw,
        ib = (this.SideBevelEnabled) ? 1 : 0,
        sf = sw * 0.8,
        slope = h / w,
        sqrt2 = Math.SQRT2,
        sqrt3 = Math.sqrt(3);

    // Base position of points w/out bevel and interval
    var w0 = w / 2 - sw / 2,        h0 = 0,
        w1 = w / 2,                 h1 = sw / 2,
        w2 = w / 2 + sw / 2,        h2 = sw,  
        w3 = w - sw,                h3 = h / 2 - sw / 2,
        w4 = w - sw / 2,            h4 = h / 2,
        w5 = w,                     h5 = h / 2 + sw / 2;
    
    // Order of segments stored in Points[][]
    var A1 = 0, A2 = 1, B = 2,  C = 3,  D1 = 4, D2 = 5, E = 6,  F = 7, 
        G1 = 8, G2 = 9, H = 10, I = 11, J = 12, K = 13, L = 14, M = 15;
    
    // Create the points array for all segments
    var points = [];   
    points[A1] = [
        { x: bw * 2 + si / sqrt2,           y: h0        },
        { x: w1 - si / 2 - sw / 2 * ib,     y: h0        },
        { x: w1 - si / 2,                   y: h1        },
        { x: w0 - si / 2,                   y: h2        },
        { x: sw + si / sqrt2,               y: h2        },
        { x: bw + si / sqrt2,               y: h0 + bw   }
    ];
    points[G2] = [
        { x: w2 + si / sqrt2,               y: h3        },
        { x: w3 - si / 2 * sqrt3,           y: h3        },
        { x: w4 - si / 2 * sqrt3,           y: h4        },
        { x: w3 - si / 2 * sqrt3,           y: h5        },
        { x: w2 + si / sqrt2,               y: h5        },
        { x: w1 + si / sqrt2,               y: h4        }
    ];
    points[B] = [
        { x: w5,           y: h0 + bw * 2 + si / sqrt2   },
        { x: w5,           y: h4 - si / 2 - sw / 2 * ib  },
        { x: w4,           y: h4 - si / 2                },
        { x: w3,           y: h3 - si / 2                },
        { x: w3,           y: h2 + si / sqrt2            },
        { x: w5 - bw,      y: h0 + bw + si / sqrt2       }
    ];
    points[I] = [
        { x: w2,           y: h2 + si / 2 * sqrt3        },
        { x: w2,           y: h3 - si / sqrt2            },
        { x: w1,           y: h4 - si / sqrt2            },
        { x: w0,           y: h3 - si / sqrt2            },
        { x: w0,           y: h2 + si / 2 * sqrt3        },
        { x: w1,           y: h1 + si / 2 * sqrt3        }
    ];
    points[H] = [
        { x: (sw + sf) / slope + si,        y: h2 + si              },
        { x: w0 - si,                       y: w0 * slope - sf - si },
        { x: w0 - si,                       y: h3 - si              },
        { x: (h3 - sf) / slope - si,        y: h3 - si              },
        { x: sw + si,                       y: h2 * slope + sf + si },
        { x: sw + si,                       y: h2 + si              }
    ];
    points[A2] = this.FlipHorizontal(points[A1], w);    // A2
    points[C]  = this.FlipVertical(points[2], h);       // C
    points[D1] = this.FlipVertical(points[0], h);       // D1
    points[D2] = this.FlipHorizontal(points[4], w);     // D2
    points[E]  = this.FlipHorizontal(points[3], w);     // E
    points[F]  = this.FlipHorizontal(points[2], w);     // F
    points[G1] = this.FlipHorizontal(points[9], w);     // G1
    points[J]  = this.FlipHorizontal(points[10], w);    // J
    points[K]  = this.FlipVertical(points[12], h);      // K
    points[L]  = this.FlipVertical(points[11], h);      // L
    points[M]  = this.FlipVertical(points[10], h);      // M
    this.Points = points;
};

// Sets the mapping of characters to bitmasks. Bitmasks store a display pattern.
// Segments are turned on by flipping the bit in the segments position.
SixteenSegment.prototype.CharacterMasks = (function() {
    "use strict";
    // Segment Bitmasks for individual segments. 
    // Binary Or them together to create bitmasks
    // a1|a2|b|c|d1|d2|e|f|g1|g2|h|i|j|k|l|m
    var a1 = 1 << 0,    a2 = 1 << 1,    b = 1 << 2,    c = 1 << 3,
        d1 = 1 << 4,    d2 = 1 << 5,    e = 1 << 6,    f = 1 << 7,
        g1 = 1 << 8,    g2 = 1 << 9,    h = 1 << 10,   i = 1 << 11, 
        j  = 1 << 12,   k  = 1 << 13,   l = 1 << 14,   m = 1 << 15;
    // Character map associates characters with a bit pattern
    return { 
        ' ' : 0,
        ''  : 0,
        '0' : a1|a2|b|c|d1|d2|e|f|j|m,
        '1' : b|c|j,
        '2' : a1|a2|b|d1|d2|e|g1|g2,
        '3' : a1|a2|b|c|d1|d2|g2,
        '4' : b|c|f|g1|g2,
        '5' : a1|a2|c|d1|d2|f|g1|g2,
        '6' : a1|a2|c|d1|d2|e|f|g1|g2,
        '7' : a1|a2|b|c,
        '8' : a1|a2|b|c|d1|d2|e|f|g1|g2,
        '9' : a1|a2|b|c|f|g1|g2,
        'A' : e|f|a1|a2|b|c|g1|g2,
        'B' : a1|a2|b|c|d1|d2|g2|i|l,
        'C' : a1|a2|f|e|d1|d2,
        'D' : a1|a2|b|c|d1|d2|i|l,
        'E' : a1|a2|f|e|d1|d2|g1|g2,
        'F' : a1|a2|e|f|g1 ,
        'G' : a1|a2|c|d1|d2|e|f|g2,
        'H' : b|c|e|f|g1|g2,
        'I' : a1|a2|d1|d2|i|l,
        'J' : b|c|d1|d2|e,
        'K' : e|f|g1|j|k,
        'L' : d1|d2|e|f,
        'M' : b|c|e|f|h|j,
        'N' : b|c|e|f|h|k,
        'O' : a1|a2|b|c|d1|d2|e|f,
        'P' : a1|a2|b|e|f|g1|g2,
        'Q' : a1|a2|b|c|d1|d2|e|f|k,
        'R' : a1|a2|b|e|f|g1|g2|k,
        'S' : a1|a2|c|d1|d2|f|g1|g2,
        'T' : a1|a2|i|l,
        'U' : b|c|d1|d2|e|f,
        'V' : e|f|j|m,
        'W' : b|c|e|f|k|m,
        'X' : h|j|k|m,
        'Y' : b|f|g1|g2|l,
        'Z' : a1|a2|d1|d2|j|m,
        '-' : g1|g2,
        '?' : a1|a2|b|g2|l,
        '+' : g1|g2|i|l,
        '*' : g1|g2|h|i|j|k|l|m
    };
}());