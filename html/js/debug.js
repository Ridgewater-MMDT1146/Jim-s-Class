// debug.js

// Display object contents.
// If i is undefined only the first level indexes are displayed as console.info().
// If i is '' then no index is used for display of the object.
// If i is an index then the index is used for display of the object.
function clog(name,obj,i) {
	var c;
	var j;
	var cn = name+': {';
	var prefix = ' ';
	if ( i != undefined ) {
		if ( i != '' ) {
			for ( j in obj[i] ) { if (!obj[i].hasOwnProperty(j)){continue;}
				if ( typeof obj[i][j] != 'number' ) { c = "'"; } else { c = ''; }
				cn += prefix+j+':'+c+obj[i][j]+c;
				prefix = ', ';
			}
		} else {
			for ( j in obj ) { if (!obj.hasOwnProperty(j)){continue;}
				if ( typeof obj[j] != 'number' ) { c = "'"; } else { c = ''; }
				cn += prefix+j+':'+c+obj[j]+c;
				prefix = ', ';
			}
		}
		cn += ' }';
		console.log(cn);
	} else {
		for ( j in obj ) { if (!obj.hasOwnProperty(j)){continue;}
			if ( typeof obj[j] != 'number' ) { c = "'"; } else { c = ''; }
			cn += prefix+c+j+c;
			prefix = ', ';
		}
		cn += ' }';
		console.info(cn);
	}
}

/** /
function getAllProperties(obj) {
  var properties = '';
  for (property in obj) {
    properties += '\n' + property;
  }
  alert('Properties of object:' + properties);
}
/**/
