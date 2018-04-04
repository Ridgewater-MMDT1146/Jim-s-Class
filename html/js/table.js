// table.js

debugOn_tables = 0;

// rowHide(rowObj)
// Hide the row.
function rowHide(rowObj) {
  eId=document.getElementById(rowObj);
  if (eId) {
    try {
      eId.style.display='none';
    } catch(e) {
      eId.style.display = 'none';
    }
  }
}
// rowShow(rowObj)
// Show the row.
function rowShow(rowObj) {
  eId=document.getElementById(rowObj);
  if (eId) {
    try {
      eId.style.display='table-row';
    } catch(e) {
      eId.style.display = 'block';
    }
  }
}
// rowHideShow(rowObj)
// Toggle display of the row.
function rowHideShow(rowObj) {
  eId=document.getElementById(rowObj);
  if (eId.style.display == 'none') {
    rowShow(rowObj)
  } else {
    rowHide(rowObj)
  }
}
