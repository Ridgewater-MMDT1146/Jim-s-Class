// updateHTMLelementPause.js
function updateAutoPause() {
  if (opener.document && opener.document.UpdateHTMLelement) {
    opener.document.UpdateHTMLelement.UpdateAutoFlag.value = false;
  }
}
function updateAutoRestart() {
  if (opener.document && opener.document.UpdateHTMLelement) {
    opener.document.UpdateHTMLelement.UpdateAutoFlag.value = true;
    //alert(opener.document.UpdateHTMLelement.UpdateAutoFlag.value);
  }
}
