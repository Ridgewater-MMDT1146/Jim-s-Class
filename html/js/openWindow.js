/* openWindow.js
Open a window. The default is a resizable window 750x550 with scrollbars enabled centered on the screen.
        url = Page to load in the window. Default is "/".
      width = Width of the window in pixels. Default is 90% of screen width.
     height = Height of the window in pixels. Default is 80% of screen height.
        top = Distance window is from the top of the screen. Default is to center the window. 
       left = Distance window is from the left of the screen. Default is to center the window. 
     status = 0: No display. 1: Display the status bar.
    toolbar = 0: No display. 1: Display the standard browser toolbar.
   location = 0: No display. 1: Display the location entry field.
    menubar = 0: No display. 1: Display the menu bar.
directories = 0: No display. 1; Display the standard browser directory buttons.
  resizable = 1: Allow the user to resize the window. 0: Disallow the user to resize the window.
 scrollbars = 1: Enable the scrollbars. 0: Disable the scrollbars.
*/
function openWindow(url,name,width,height,top,left,status,toolbar,location,menubar,directories,resizable,scrollbars) {
  if (url == null) {url = "/";}
  if (width == null) {width = Math.floor(screen.width*.9);}
  if (height == null) {height = Math.floor(screen.height*.8);}
  if (top == null || top == -1) {top = Math.floor( (screen.height - height) / 4);}
  if (left == null || left == -1) {left = Math.floor( (screen.width - width) / 2);}
  //alert('screen.width='+Math.floor(screen.width)+' screen.height='+Math.floor(screen.height)+' width='+width+' height='+height+' top='+top+' left='+left+'.');
  //var winParms = "width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;
  var winParms = "dialogWidth=" + width + "px;dialogHeight=" + height + "px;dialogTop=" + top + "px;dialogLeft=" + left + 'px';
  if (status != null) {if (status == 1) {winParms += ";status=yes";}}
  //if (toolbar != null) {if (toolbar == 1) {winParms += ",toolbar=yes";}}
  //if (location != null) {if (location == 1) {winParms += ",location=yes";}}
  //if (menubar != null) {if (menubar == 1) {winParms += ",menubar=yes";}}
  //if (directories != null) {if (directories == 1) {winParms += ",directories=yes";}}
  if (resizable != null) {if (resizable == 1) {winParms += ";resizable=yes";}} else {winParms += ";resizable=yes";}
  //if (scrollbars != null) {if (scrollbars == 1) {winParms += ",scrollbars=yes";}} else {winParms += ",scrollbars=no";}
  if (scrollbars != null) {if (scrollbars == 1) {winParms += ";scroll=yes";}} else {winParms += ";scroll=no";}
  //var win = window.open(url, name, winParms);
  // window.showModalDialog('URL' , null, 'dialogHeight=400px,dialogWidth=300px,status=no,toolbar=no,menubar=no,location=no'); 
  var win = window.showModalDialog(url, name, winParms);
  //if ( onunload != undefined) win.onunload = onunload;
  //if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
  //win.window.focus();
  return win;
}
