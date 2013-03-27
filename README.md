Sixteen Segment Display
==============
Sixteen segment display control using the Html5 canvas

License
-------
Sixteen Segment Display is available under the [MIT license] (http://opensource.org/licenses/MIT).

Using the Code
-------

To add a sixteen segment display to your page create a new SixteenSegment object and pass the Canvas and number of display elements as parameters to the constructor. 

```javascript
var segment16 = new SixteenSegment(canvas, 11);
segment16.DisplayText("Hello World");
```

The canvas property is the only one you are required to set for the display to work.  All other properties have a default value. Settings can be passed to the constructor or set as properties.

```javascript
// This works too
var segment16 = new SixteenSegment();
segment16.Canvas = canvas;
segment16.ElementArray.SetCount(count);
segment16.DisplayText("Hello World");
```

Configuring the display properties
-------
By default the display will set its width and height equal to that of the canvas.  This is convenient because the display automatically fills the control area and you can control the dimensions of the element in HTML and CSS.  However if you want to explicitly set the dimensions of the display you can set these properties manually.

```javascript
// Draws a sixteen segment display 200px wide and 100px tall
var segment16 = new SixteenSegment(canvas, 4, 200, 100);

// This works too
var segment16 = new SixteenSegment(canvas, 4);
segment16.Width = 200;
segment16.Height = 100;

// Display is 200px wide and fills the canvas height
var segment16 = new SixteenSegment(canvas, 4, 200);

// Display is 200px tall and fills the canvas width
var segment16 = new SixteenSegment(canvas, 4, null, 200);
```

Additionally you can set the position of the display on the canvas by adding x and y coordinates.  These coordinates are relative to the top right corner of the canvas and default to (0,0).

```javascript
// Draws a sixteen segment display starting at position (50, 400);
var segment16 = new SixteenSegment(canvas, 4, 200, 100, 50, 400);

// This works too
var segment16 = new SixteenSegment(canvas, 4, 200, 100);
segment16.X = 50;
segment16.Y = 400;
```

Using these settings multiple displays can share the same canvas

```javascript
canvas.width = 410;
canvas.height = 100;
var segmentA = new SixteenSegment(canvas, 4, 200, 100, 0, 0);
var segmentB = new SixteenSegment(canvas, 4, 200, 100, 210, 0);
segmentA.DisplayText(“Hello”);
segmentA.DisplayText(“World”); 
```

Customizing the display
-------
The style of the segments can be extensively customized by modifying properties that define how the segments are rendered.  The demo page lets you experiment with different settings and can be downloaded in the source files attached to this article or you can check out the live example.

```javascript
this.SegmentWidth = .16;            // Width of segments (% of Element Width)
this.SegmentInterval = .05;         // Spacing between segments (% of Element Width)
this.BevelWidth = .06;              // Size of corner bevel (% of Element Width)
this.SideBevelEnabled = false;      // Determines if the sides should be beveled
this.FillLight = "#86fd06";         // Color of an on segment
this.FillDark = "#004400";          // Color of an off segment
this.StrokeLight = "#007700";       // Color of an on segment outline
this.StrokeDark = "#440044";        // Color of an off segment outline
this.LineWidth = 0;                 // Width of segment outline
this.Padding = 10;                  // Padding around the display
this.Spacing = 5;                   // Spacing between elements
```

Custom Display Patterns
-------
Characters are mapped to display patterns through the CharacterMasks property.  This property is a lookup object which holds display patterns indexed by character.  The display pattern describes which segments should be turned on.  This information is encoded in a 16 bit number as a bitmask with a bit for each segment.  A 1 indicates that the segment should be turned on and a 0 indicates it should be turned off. 

The CharacterMasks object contains display patterns for all alphanumeric characters.  You can add additional characters or create your own custom display patterns by adding new values to the lookup.  The value of the bitmask should be a 16 bit number with a bit set to 1 for each segment that should be turned on.  

To display the character 'A' you need to turn on 8 of the segments.

```javascript
A: 1111001111000000

// Bitmask can be represented in several ways
var charMasks = SixteenSegment.prototype.CharacterMasks;
charMasks['A'] = a1 | a2 | b | c | g1 | g2 | e | f |;    // Segment masks
charMasks['A'] = parseInt('1111001111000000', 2);	    // Binary
charMasks['A'] = 0x3CF;					    // Hex
charMasks['A'] = 975;					    // Decimal
```
The preferred way to set a display pattern is to  use the segment bitmasks. A variable for each segment holds the bit that turns on its segment. When multiple segment masks are binary or'ed together you get a value the represents the desired pattern.  This makes reading and creating new patterns very intuitive.

```javascript
// Bitmasks for individual segments
var a1 = 1 << 0,    a2 = 1 << 1,    b = 1 << 2,    c = 1 << 3,
    d1 = 1 << 4,    d2 = 1 << 5,    e = 1 << 6,    f = 1 << 7,
    g1 = 1 << 8,    g2 = 1 << 9,    h = 1 << 10,   i = 1 << 11,	
    j  = 1 << 12,   k  = 1 << 13,   l = 1 << 14,   m = 1 << 15;

// Turn on the g1 and g2 segments
charMasks['-'] = g1 | g2;    // 0000001100000000
```

Extending the Display
-------
The sixteen segment display is made up of three function objects. SixteenSegment, SegmentCanvas, and SegmentArray.

`SegmentArray` is responsible for setting the display patterns and storing the value of multiple elements.  It is independent from rendering the control or drawing anything to a canvas.  It just manages setting the bit pattern for each element given a text input.

`SegementCanvas` provides generic functionality for drawing the display to the canvas.  This includes properties for customizing the shape and position of the display.  It requires that an inheriting object implement the details that define the shape and number of segments. 

`SixteenSegment` extends the SegmentCanvas object with functionality specific to a sixteen segment display.  This means it has to set two properties.  The Points property defines the segment geometery for a sixteen segment layout.  The CharacterMasks property provides a lookup that maps characters to their desired sixteen segment pattern.

New display types can be created in the same way by extending the SegmentCanvas object and implementing the Points[][] array and CharacterMasks lookup.  For instance it’s easy to create seven segment display leveraging the existing code.