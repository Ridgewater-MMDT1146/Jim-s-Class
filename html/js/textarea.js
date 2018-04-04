// textarea.js

// resizeTextareas(maxWidth)
// Resizes all textareas on the page.
// minWidth = The minimum textarea width.
// maxWidth = The maximum textarea width.
function resizeTextareas(minWidth, maxWidth) {
  //alert('resizeTextareas('+maxWidth+')');
	var textareas = document.getElementsByTagName("textarea");
  for ( $i=0; $i<textareas.length; $i++ ) {
    resizeTextareaById(textareas[$i], minWidth, maxWidth)
  }
}

// resizeTextarea(eName,maxWidth)
// Resizes eName textarea.
// maxWidth = The maximum textarea width.
function resizeTextarea(eName, minWidth, maxWidth) {
  eId = document.getElementById(eName);
  resizeTextareaById(eId,maxWidth);
}

// resizeTextareaById(eId, maxWidth)
// Called by resizeTextareas() or resizeTextarea() to resize this textarea.
function resizeTextareaById(eId, minWidth, maxWidth) {
	console.log('resizeTextareaById('+eId.name+','+minWidth+','+maxWidth+')');
  var width = 0; // Used to calculate the textarea's current width.
  var height = 0; // Used to calculate the textarea's current height.
  //var minWidth = 20; // The textarea's minimum width.
  var minHeight = 5; // The textarea's minimum height.
	var linelengthmodifier = 1.1; // Used to modify linelength due to font.
  lines = eId.value.split('\n'); // Get an array of the textarea's lines.
  //alert('name='+eId.name+' value='+eId.value);
  for (var i = 0; i < lines.length; i++) { // Loop through each line.
    var linelength = lines[i].length * linelengthmodifier; // Get the line length.
		console.log(linelength);
    if ( linelength > width ) width = linelength; // Increase width if needed.
    height++; // Increment height.
  }
	//height *= 1.4;
  if ( width > maxWidth ) { // If width too large reset it and increment height.
		console.log('width='+width+' > maxWidth'+maxWidth);
		width = maxWidth;
		for (var i = 0; i < lines.length; i++) { // Loop through each line.
			var linelength = lines[i].length; // Get the line length.
			if ( linelength > width ) height++; // Increment height.
		}
		height++; // Increment height.
	}
  if ( width < minWidth ) width = minWidth; // If width too small set to minWidth.
  if ( height < minHeight ) height = minHeight; // If height too small set to minHeight.
  console.log('name='+eId.name+' width='+width+' height='+height);
  if ( width > 0 ) eId.cols = width; // Set the textarea's width.
  if ( height > 0 ) eId.rows = height; // Set the textarea's height.
}
