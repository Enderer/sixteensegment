/*******************************************************************************
 * SixteenSegment
 * Implements Points[] and CharacterMasks[] for a sixteen segment display 
 ******************************************************************************/
function SixteenSegment(count, canvas, width, height, x, y)
{
	// Set the starting position on the canvas. Default is (0,0)
	this.X = x || 0;
    this.Y = y || 0;

    // Set size of display. Defaults to the size of the canvas
    this.Width = width || canvas.width;
    this.Height = height || canvas.height;
	
	this.Canvas = canvas;
	this.CalcPoints();
	this.ElementArray.SetCount(count);
}

// Implements SegmentCanvas using Points[][] and CharacterMasks[] for 16 segments
SixteenSegment.prototype = new SegmentCanvas();

// Calculates the point positions for each segment & stores them in Points[][].
// Ex. The first point for the second segment is stored at Points[1][0];
// Segments are labeled a1, a2, b, c, d1, d2, e, f, g1, g2, h, i, j, k, l, m
SixteenSegment.prototype.CalcPoints = function() 
{
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

	var w0 = w / 2 - sw / 2;
	var w1 = w / 2;
	var w2 = w / 2 + sw / 2;
	var w3 = w - sw;
	var w4 = w - sw / 2;
	var w5 = w;

	var h0 = 0;
	var h1 = sw / 2;
	var h2 = sw;
	var h3 = h / 2 - sw / 2;
	var h4 = h / 2;
	var h5 = h / 2 + sw / 2;


	var points = new Array();
	this.Points = points;

	for (var s = 0; s < 16; s++) {
	    points[s] = new Array();
	    for (var p = 0; p < 6; p++) {
	        points[s][p] = {}
	    }
	}

	// A1
	points[0][0] = { x: bw * 2 + si / sqrt2,			y: h0 };
	points[0][1] = { x: w1 - si / 2 - sw / 2 * ib,		y: h0 };
	points[0][2] = { x: w1 - si / 2,					y: h1 };
	points[0][3] = { x: w0 - si / 2,					y: h2 };
	points[0][4] = { x: sw + si / sqrt2,				y: h2 };
	points[0][5] = { x: 0 + bw + si / sqrt2,			y: h0 + bw };

	// A2
	points[1] = this.FlipHorizontal(points[0], w);
	
	// B
	points[2][0].x = w5;
	points[2][1].x = w5;
	points[2][2].x = w4;
	points[2][3].x = w3;
	points[2][4].x = w3;
	points[2][5].x = w5 - bw;

	points[2][0].y = h0 + bw * 2 + si / sqrt2;
	points[2][1].y = h4 - si / 2 - sw / 2 * ib;
	points[2][2].y = h4 - si / 2;
	points[2][3].y = h3 - si / 2;
	points[2][4].y = h2 + si / sqrt2;
	points[2][5].y = h0 + bw + si / sqrt2;
	
	// C
	points[3] = this.FlipVertical(points[2], h);
	// D1 
	points[4] = this.FlipVertical(points[0], h);
	// D2
	points[5] = this.FlipHorizontal(points[4], w);
	// E
	points[6] = this.FlipHorizontal(points[3], w);
	// F
	points[7] = this.FlipHorizontal(points[2], w);
	
	// G2
	points[9][0].x = w2 + si / sqrt2;
	points[9][1].x = w3 - si / 2 * sqrt3;
	points[9][2].x = w4 - si / 2 * sqrt3;
	points[9][3].x = w3 - si / 2 * sqrt3;
	points[9][4].x = w2 + si / sqrt2;
	points[9][5].x = w1 + si / sqrt2;

	points[9][0].y = h3;
	points[9][1].y = h3;
	points[9][2].y = h4;
	points[9][3].y = h5;
	points[9][4].y = h5;
	points[9][5].y = h4;
	
	// G1
	points[8] = this.FlipHorizontal(points[9], w);

	// H
	points[10][0].x = (sw + sf) / slope + si;
	points[10][1].x = w / 2 - sw / 2 - si;
	points[10][2].x = w / 2 - sw / 2 - si;
	points[10][3].x = (h / 2 - sw / 2 - sf) / slope - si;
	points[10][4].x = sw + si;
	points[10][5].x = sw + si;

	points[10][0].y = sw + si;
	points[10][1].y = (w / 2 - sw / 2) * slope - sf - si;
	points[10][2].y = h / 2 - sw / 2 - si;
	points[10][3].y = h / 2 - sw / 2 - si;
	points[10][4].y = sw * slope + sf + si;
	points[10][5].y = sw + si;
	// I
	points[11][0].x = w2;
	points[11][1].x = w2;
	points[11][2].x = w1
	points[11][3].x = w0;
	points[11][4].x = w0;
	points[11][5].x = w1;

	points[11][0].y = h2 + si / 2 * sqrt3;
	points[11][1].y = h3 - si / sqrt2;
	points[11][2].y = h4 - si / sqrt2;
	points[11][3].y = h3 - si / sqrt2;
	points[11][4].y = h2 + si / 2 * sqrt3;
	points[11][5].y = h1 + si / 2 * sqrt3;
	// J
	points[12] = this.FlipHorizontal(points[10], w);
	// K
	points[13] = this.FlipVertical(points[12], h);
	// L
	points[14] = this.FlipVertical(points[11], h);
	// M
	points[15] = this.FlipVertical(points[10], h);
}

// Sets the mapping of characters to bitmasks. Bitmasks store a display pattern.
// Segments are turned on by flipping the bit in the segments position.
SixteenSegment.prototype.CharacterMasks = (function() 
{
	// Segment Bitmasks for individual segments
	var a1 = 1 << 0,    a2 = 1 << 1,    b = 1 << 2,    c = 1 << 3,
	    d1 = 1 << 4,    d2 = 1 << 5,    e = 1 << 6,    f = 1 << 7,
	    g1 = 1 << 8,    g2 = 1 << 9,    h = 1 << 10,   i = 1 << 11,	
	    j  = 1 << 12,   k  = 1 << 13,   l = 1 << 14,   m = 1 << 15;

	// Character map associates characters with a bit pattern
	var charMasks = { };
	charMasks[' '] = 0;
	charMasks[''] = 0;
	charMasks['0'] = a1 | a2 | b | c | d1 | d2 | e | f | j | m;
	charMasks['1'] = b | c | j;
	charMasks['2'] = a1 | a2 | b | d1 | d2 | e | g1 | g2;
	charMasks['3'] = a1 | a2 | b | c | d1 | d2 | g2;
	charMasks['4'] = b | c | f | g1 | g2;
	charMasks['5'] = a1 | a2 | c | d1 | d2 | f | g1 | g2;
	charMasks['6'] = a1 | a2 | c | d1 | d2 | e | f | g1 | g2;
	charMasks['7'] = a1 | a2 | b | c;
	charMasks['8'] = a1 | a2 | b | c | d1 | d2 | e | f | g1 | g2;
	charMasks['9'] = a1 | a2 | b | c | f | g1 | g2;
	charMasks['A'] = e | f | a1 | a2 | b | c | g1 | g2;
	charMasks['B'] = a1 | a2 | b | c | d1 | d2 | g2 | i | l;
	charMasks['C'] = a1 | a2 | f | e | d1 | d2;
	charMasks['D'] = a1 | a2 | b | c | d1 | d2 | i | l;
	charMasks['E'] = a1 | a2 | f | e | d1 | d2 | g1 | g2;
	charMasks['F'] = a1 | a2 | e | f | g1 ;
	charMasks['G'] = a1 | a2 | c | d1 | d2 | e | f | g2;
	charMasks['H'] = b | c | e | f | g1 | g2;
	charMasks['I'] = a1 | a2 | d1 | d2 | i | l;
	charMasks['J'] = b | c | d1 | d2 | e;
	charMasks['K'] = e | f | g1 | j | k;
	charMasks['L'] = d1 | d2 | e | f;
	charMasks['M'] = b | c | e | f | h | j;
	charMasks['N'] = b | c | e | f | h | k;
	charMasks['O'] = a1 | a2 | b | c | d1 | d2 | e | f;
	charMasks['P'] = a1 | a2 | b | e | f | g1 | g2;
	charMasks['Q'] = a1 | a2 | b | c | d1 | d2 | e | f | k;
	charMasks['R'] = a1 | a2 | b | e | f | g1 | g2 | k;
	charMasks['S'] = a1 | a2 | c | d1 | d2 | f | g1 | g2;
	charMasks['T'] = a1 | a2 | i | l;
	charMasks['U'] = b | c | d1 | d2 | e | f;
	charMasks['V'] = e | f | j | m;
	charMasks['W'] = b | c | e | f | k | m;
	charMasks['X'] = h | j | k | m;
	charMasks['Y'] = b | f | g1 | g2 | l;
	charMasks['Z'] = a1 | a2 | d1 | d2 | j | m;
	charMasks['-'] = g1 | g2;
	charMasks['?'] = a1 | a2 | b | g2 | l;
	charMasks['+'] = g1 | g2 | i | l;
	charMasks['*'] = g1 | g2 | h | i | j | k | l | m;
	return charMasks;
})();