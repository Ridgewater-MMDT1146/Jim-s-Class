/* screenSizeToCookie.js
Stores the screen resolution (width and height) in cookie values.
Requires setCookie.js.
  size = width + "x" + height.
 width = width.
height = height.
*/
function screenSizeToCookie() {
  var size = screen.width+"x"+screen.height;
  var width = screen.width;
  var height = screen.height;
  setCookie("size",size);
  setCookie("width",width);
  setCookie("height",height);
}
