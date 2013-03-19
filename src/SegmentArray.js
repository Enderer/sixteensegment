/*******************************************************************************
 * Segment Array
 * Holds an array of bitmask which store the display pattern for a segmented
 * display.  Provides functions for setting the pattern to display text
 ******************************************************************************/
function ElementArray(count) 
{
    this.SetCount(count || 0);
}

// Sets the number of elements in the display
ElementArray.prototype.SetCount = function(count)
{
    var c = parseInt(count);
    if (isNaN(c)) throw "Invalid element count: " + count;
    this.Elements = [c];
    for(var i = 0; i < c; i++) 
        this.Elements[i] = 0;
}

// Sets the display pattern to show the given text
ElementArray.prototype.SetText = function(value, charMaps)
{
    // Get the string of the value passed in
    if (value == null) value = "";
    value = value.toString();
    
    // Clear the elements
    for (var i = 0; i < this.Elements.length; i++) 
        this.Elements[i] = 0;
    if (value.length == 0) return;

    // Set the bitmask to dispay the proper character for each element
    for(var i=0; i < this.Elements.length && i < value.length; i++){
        var c = value[i];
        var mask = charMaps[c];
        // Use blank of there is no bitmask for this character
        if (mask == null && mask == undefined) mask = this.NullMask;
        this.Elements[i] = mask;
    }
}

// Sets the bitmask pattern for a specific element in the display
ElementArray.prototype.SetElementValue = function(i, value)
{
    if (i > 0 && i < this.Elements.length){
        this.Elements[i] = parseInt(val);
    }
}