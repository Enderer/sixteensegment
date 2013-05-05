/*******************************************************************************
 * SegmentCanvas
 * @constructor 
 * Base functionality for drawing a segment display to a canvas. Loops through
 * each element (this.ElementArray) and draws each segment shape (this.Points[][])
 * Allows you to configure the design by changing settings(bevel, color, etc...)
 ******************************************************************************/
function SegmentCanvas() {
    "use strict";
    this.SegmentWidth = 0.16;           // Width of segments (% of Element Width)
    this.SegmentInterval = 0.05;        // Spacing between segments (% of Element Width)
    this.BevelWidth = 0.06;             // Size of corner bevel (% of Element Width)
    this.SideBevelEnabled = false;      // Should the sides be beveled
    this.FillLight = "#86FD06";         // Color of an on segment
    this.FillDark = "#004400";          // Color of an off segment
    this.StrokeLight = "#007700";       // Color of an on segment outline
    this.StrokeDark = "#440044";        // Color of an off segment outline
    this.StrokeWidth = 0;               // Width of segment outline
    this.Padding = 10;                  // Padding around the display
    this.Spacing = 10;                  // Spacing between elements
    this.X = 0;                         // Starting position on the canvas
    this.Y = 0;
    this.Width = 200;                   // Default size of the display
    this.Height = 100;
    this.ElementArray = new ElementArray(1);
}

// Sets the display output to the given text, recalculates 
// the segment points and draws the segment to the canvas
SegmentCanvas.prototype.DispayText = function(value) {
    "use strict";
    // Recalculate points in case any settings changed
    this.CalcPoints();
    // Set the display patterns and draw the canvas
    this.ElementArray.SetText(value, this.CharacterMasks);
    this.Draw(this.Canvas, this.ElementArray.Elements);
};

// Draws the segment display to a canvas
SegmentCanvas.prototype.Draw = function(canvas, elements) {
    "use strict";
    // Get the context and clear the area
    var context = canvas.getContext('2d');
    context.clearRect(this.X, this.Y, this.Width, this.Height);
    context.save();

    // Calculate the width and spacing of each element
    var elementWidth = this.CalcElementDimensions().Width;

    // Offset to adjust for starting point and padding
    context.translate(this.X, this.Y);
    context.translate(this.Padding, this.Padding);

    // Draw each segment of each element
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        for (var s = 0; s < this.Points.length; s++) {
            // Pick the on or off color based on the bitmask
            var color = (element & 1 << s) ? this.FillLight : this.FillDark;
            var stroke = (element & 1 << s) ? this.StrokeLight : this.StrokeDark;
            context.lineWidth = this.StrokeWidth;
            context.strokeStyle = stroke;
            context.fillStyle = color;
            context.beginPath();
            context.moveTo(this.Points[s][0].x, this.Points[s][0].y);
            // Create the segment path
            for(var p = 1; p < this.Points[s].length; p++) {
                context.lineTo(this.Points[s][p].x, this.Points[s][p].y);
            }
            context.closePath();
            context.fill();
            if (this.StrokeWidth > 0) { context.stroke(); }
        }
        context.translate(elementWidth + this.Spacing, 0);
    }
    context.restore();
};

// Set the number of elements in the display
SegmentCanvas.prototype.SetCount = function(count) {
    "use strict";
    this.ElementArray.SetCount(count);
};

// Get the number of elements in the display
SegmentCanvas.prototype.GetCount = function() {
    "use strict";
    return this.ElementArray.Elements.length;
};

// Calculates the width and height of a single display element
// based on the number of elements and space available in the control
SegmentCanvas.prototype.CalcElementDimensions = function() {
    "use strict";
    var n = this.ElementArray.Elements.length;
    var h = this.Height;
    h -= this.Padding * 2;

    var w = this.Width;
    w -= this.Spacing * (n - 1);
    w -= this.Padding * 2;
    w /= n;

    return { Width: w, Height: h };
};

// Creates a new set of points flipped vertically
SegmentCanvas.prototype.FlipVertical = function(points, height) {
    "use strict";
    var flipped = [];
    for(var i=0;i<points.length;i++) {
        flipped[i] = {};
        flipped[i].x = points[i].x;
        flipped[i].y = height - points[i].y;
    }
    return flipped;
};

// Creates a new set of points flipped horizontally
SegmentCanvas.prototype.FlipHorizontal = function(points, width) {
    "use strict";
    var flipped = [];
    for(var i=0;i<points.length;i++) {
        flipped[i] = {};
        flipped[i].x = width - points[i].x;
        flipped[i].y = points[i].y;
    }
    return flipped;
};

// Creates a lighter or darker version of  the color
SegmentCanvas.GetRGB = function(hex) {
    var val = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return { R : r, G : g, B : b };
}

SegmentCanvas.Lerp = function(start, end, amount) {
    var difference = end - start;
    var adjusted = difference * amount;
    return start + adjusted;
}

SegmentCanvas.LerpColor = function(colour, colour1, amount) {
    // start colours as lerp-able floats
    var rgb = hexToRgb(colour);
    var rgb1 = hexToRgb(colour1);
    var sr = rgb.R, sg = rgb.G, sb = rgb.B;

    // end colours as lerp-able floats
    var er = rgb1.R, eg = rgb1.G, eb = rgb1.B;

    // lerp the colours to get the difference
    var  r = SegmentCanvas.Lerp(sr, er, amount),
         g = SegmentCanvas.Lerp(sg, eg, amount),
         b = SegmentCanvas.Lerp(sb, eb, amount);

    // return the new colour
    return rgbToHex(r, g, b);
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        R: parseInt(result[1], 16),
        G: parseInt(result[2], 16),
        B: parseInt(result[3], 16)
    } : null;
}


function rgbToHex(r, g, b) {
    return "#" + parseInt((1 << 24) + (r << 16) + (g << 8) + b, 10).toString(16).slice(1);
}