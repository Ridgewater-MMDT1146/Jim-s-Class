/*
* 2013 Jakub Siemiatkowski
* @sasklacz
* jsiemiatkowski at gmail.com
*
*/
(function(){
    /*
    * Array storing events to be rendered in the calendar
    */
    var EVENTS_TO_RENDER = [];

    /*
    * Object storing events as keys, and array of their overlapping events as values
    */
    var EVENTS_OVERLAPPING = {};

    /*
    * Object storing events with position and width already set
    */
    var EVENTS_READY = {};

    /*
    * Template of a single event in the calendar
    */
    var EVENT_TEMPLATE = [
        '<div class="event" style="top: {{top}}px; left: {{left}}px; height: {{height}}px; width: {{width}}px">',
            '<div class="bar"></div>',
            '<div class="content" style="width: {{contentWidth}}px">',
                '<div class="inner-content">',
                    '<span class="event-title">{{title}}</span>',
                    '<span class="event-location">{{location}}</span>',
					'{{content}}',
                '</div>',
            '</div>',
        '</div>'
    ].join('');

    /*
    * ID selector for the calendar DOM element where events are to be added
    */
    var CALENDAR_SELECTOR = 'scheduler';

    /*
    * Function for sorting array of event objects by their start and position paremeters. Added to prototype
    * for better readability
    */
    Array.prototype.sortArray = function () {
        this.sort(function(a, b) {
            if (a.start > b.start){
                return 1;
            } else if (a.start < b.start){
                return -1;
            } else {
                if (a.position > b.position){
                    return 1;
                } else if (a.position < b.position){
                    return -1;
                }
                return 0;
            }
        });
    };
    Array.prototype.sortTitle = function () {
        this.sort(function(a, b) {
			if ( a.title){
				//console.log(a.title);
				if (a.title > b.title){
					return 1;
				} else if (a.title < b.title){
					return -1;
				}
			} else {
				//console.log('No title');
			}
            return 0;
        });
    };

    /*
    * Fill string template with data using simple regexes
    */
    var fillTemplate = function (data) {
        var _template = EVENT_TEMPLATE,
            key, regex;
        
        for (key in data) {
            regex     = new RegExp('{{' + key + '}}', 'ig');
            _template = (_template).replace(regex, data[key]);
        }

        return _template;
    };

    /*
    * Check all events against themselves if they're start/end values overlap.
    */
    var getEventsOverlapping = function(){
			console.warn('getEventsOverlapping[]');
        var currentStart,
            currentEnd,
            objectKey,
            overlappingEvent,
						thisKey;

        for (var i=0, l=EVENTS_TO_RENDER.length; i<l; i+=1){
            currentStart = EVENTS_TO_RENDER[i].start;
            currentEnd   = EVENTS_TO_RENDER[i].end;
            //objectKey    = currentStart+'*'+currentEnd+'*'+EVENTS_TO_RENDER[i].position;
            objectKey    = EVENTS_TO_RENDER[i].title;

            EVENTS_OVERLAPPING[objectKey] = {items: {}, length: 0};

            for (var j=0; j<l; j+=1){
                if (j !== i){
                    overlappingEvent = EVENTS_TO_RENDER[j];
                    if ((overlappingEvent.start < currentStart && overlappingEvent.end > currentStart) ||
                        (overlappingEvent.start > currentStart && overlappingEvent.start < currentEnd) ||
                        overlappingEvent.start === currentStart && overlappingEvent.end > currentStart){
											 //thisKey = overlappingEvent.start+'*'+overlappingEvent.end+'*'+overlappingEvent.position;
											 thisKey = overlappingEvent.title;
                       EVENTS_OVERLAPPING[objectKey].items[thisKey]       = 1;
                       EVENTS_OVERLAPPING[objectKey].length += 1; 
                    } 
                }                  
            }

            if (!overlappingEvent){
                EVENTS_OVERLAPPING[objectKey] = null;
            }
        }    
//console.log('EVENTS_OVERLAPPING='+JSON.stringify(EVENTS_OVERLAPPING));
console.info('EVENTS_OVERLAPPING=');
for ( var index in EVENTS_OVERLAPPING ) {if(EVENTS_OVERLAPPING.hasOwnProperty(index)) {
	console.log("\t["+index+']'+JSON.stringify(EVENTS_OVERLAPPING[index]));
}}
    };

	function Events_MaxOverlap(overlapObject, eventKey) {
		console.warn('Events_MaxOverlap[]');
		console.log(eventKey+' EVENT='+JSON.stringify(overlapObject));
		var MaxLength = overlapObject.length;
		console.log('MaxLength='+MaxLength);
		for ( var index in overlapObject.items ) {if(overlapObject.items.hasOwnProperty(index)) {
			var thisLength = EVENTS_OVERLAPPING[index].length;
			console.log('thisLength='+thisLength);
			MaxLength = Math.max(MaxLength,thisLength);
		}}
		MaxLength -= 1;
		console.log('MaxLength='+MaxLength);
		
		
		
		return MaxLength;
	}
		
    /*
    * This function performs few operations. It accepts object with overlapping events of event to be rendered (let's call it E).
    * First of all it checks if E has any overlapping events. If not - then we know that it can take the full available width
    * and will be positioned at x=0. If there are overlapping events we check if they overlap with each other, because if they don't
    * then one event from each pair doesn't influence the width of E, but still it's x position can be influenced (e2) :

    ********
    *  e1  *  *******
    ********  *  E  *
    ********  *******
    *  e2  *
    ********

    * Finally we find the x position of E using the positions of events that were already positioned.
    */
		var checkCollidingOverlapping = function (overlapObject, eventKey){
			var width                   = null,
					left                    = 0,
					startingLefts           = {},
					overlappingEventsAmount = Events_MaxOverlap(overlapObject, eventKey),
					collidingEvents         = {},
					collidingEventsPairs    = 0,
					i,
					overlapCount,
					overlappingIEvents,
					overlapReadyIEvent;
			if ( overlapObject ) { // Are the overlapping items?
				console.info('Checking '+eventKey);
				for ( i in overlapObject.items ) {if(overlapObject.items.hasOwnProperty(i)){ // Loop thru overlapping items.
					console.log("\t"+i+' overlap');
					overlapReadyIEvent = EVENTS_READY[i];
					overlappingIEvents = EVENTS_OVERLAPPING[i].items;
					overlapCount = 0;
					for ( var m in overlapObject.items ) {if(overlapObject.items.hasOwnProperty(m)){ // Loop thru overlapping items again.
						if ( m !== i ) {
							overlapCount++;
							console.log("\t"+"\t"+'i='+i+' m='+m+' collidingEvents[i]='+collidingEvents[i]+' collidingEvents[m]='+collidingEvents[m]+' overlappingIEvents[m]='+overlappingIEvents[m]+' eventKey='+eventKey);
							if (collidingEvents[m] !== i && 
								collidingEvents[i] !== m &&
								!overlappingIEvents[m] &&
								m !== eventKey && i !== eventKey){
								console.info("\t"+"\t"+'Collide');
								collidingEvents[i]   = m;
								collidingEvents[m]   = i;
								collidingEventsPairs += 1;
							} else {
								console.log("\t"+"\t"+'Do not collide');
							}
						}
					}} // Loop thru overlapping items again.
					if (overlapReadyIEvent){
						console.log('overlapReadyIEvent '+i+' left='+overlapReadyIEvent.left+' width='+overlapReadyIEvent.width);
						startingLefts[overlapReadyIEvent.left] = 1;
						//overlapping events should have the same width so we can use the value of an already
						//rendered event
						width = overlapReadyIEvent.width;
					}
				}} // Loop thru overlapping items.
				if ( !overlapCount ) {
					console.log("\t"+'No colliding overlaps.');
				}
				console.log("\t"+'overlappingEventsAmount='+overlappingEventsAmount+' collidingEventsPairs='+collidingEventsPairs);
				overlappingEventsAmount -= collidingEventsPairs;
				if (!width){
					width = 600 / (overlappingEventsAmount + 1);
				}
				for (var k in startingLefts){
					if (startingLefts[left]){
						left += width;
					}
				}
			} else { // Are the overlapping items?
				width = 600;
			} // Are the overlapping items?
			return {
				width: width,
				left : left
			};
		};

    /*
    * Function that adds additional properties to events in `EVENTS_TO_RENDER` array, so that they can be
    * positioned properly in the calendar. Events with calculated position are added to `EVENTS_READY` object.
    */
    var prepareRenderData = function(){
			console.warn('prepareRenderData[]');
        var currentEvent,
            overlappingEvents,
            eventKey,
            width,
            left;
        EVENTS_READY = {};
        EVENTS_TO_RENDER.sortArray();
//console.log('EVENTS_TO_RENDER='+JSON.stringify(EVENTS_TO_RENDER));
console.info('EVENTS_TO_RENDER=');
for ( index=0; index<EVENTS_TO_RENDER.length; index++ ) {
	console.log("\t["+index+']'+JSON.stringify(EVENTS_TO_RENDER[index]));
}
        for (var i=0, l=EVENTS_TO_RENDER.length; i<l; i+=1){
            currentEvent      = EVENTS_TO_RENDER[i];
            //eventKey          = currentEvent.start+'*'+currentEvent.end+'*'+currentEvent.position;
            eventKey          = currentEvent.title;
            overlappingEvents = checkCollidingOverlapping(EVENTS_OVERLAPPING[eventKey], eventKey);

            width = overlappingEvents.width;
            left  = overlappingEvents.left;

            currentEvent.top          = currentEvent.start;
            currentEvent.width        = width;
            currentEvent.left         = left;
            currentEvent.height       = currentEvent.end - currentEvent.start;
            currentEvent.contentWidth = currentEvent.width - 4;

            EVENTS_READY[eventKey]    = {
                left: left,
                width : width
            };
					console.log("\t"+'EVENTS_READY['+eventKey+']='+JSON.stringify(EVENTS_READY[eventKey]));
        }
//console.log('EVENTS_TO_RENDER='+JSON.stringify(EVENTS_TO_RENDER));
console.info('EVENTS_TO_RENDER=');
for ( index=0; index<EVENTS_TO_RENDER.length; index++ ) {
	console.log("\t["+index+']'+JSON.stringify(EVENTS_TO_RENDER[index]));
}
/**/
//console.log('EVENTS_READY='+JSON.stringify(EVENTS_READY));
console.info('EVENTS_READY=');
for ( var index in EVENTS_READY ) {if(EVENTS_READY.hasOwnProperty(index)) {
	console.log("\t["+index+']'+JSON.stringify(EVENTS_READY[index]));
}}
/**/
    };

    /*
    * Function generating HTML for the calendar DOM element using a predefined template. I've chosen template
    * in place of DOM elements, as for each event I'm setting values for 2 elements and even when a DOM Fragment
    * was used it would still be slower and more tedious in my oppinion.
    */
    var renderEvents = function () {
			console.warn('renderEvents[]');
        var calendarElement = document.getElementById(CALENDAR_SELECTOR),
            renderHTML      = '';
//console.log('EVENTS_TO_RENDER='+JSON.stringify(EVENTS_TO_RENDER));
console.info('EVENTS_TO_RENDER=');
for ( index=0; index<EVENTS_TO_RENDER.length; index++ ) {
	console.log("\t["+index+']'+JSON.stringify(EVENTS_TO_RENDER[index]));
}

        for (var i=0, l=EVENTS_TO_RENDER.length; i<l; i+=1){
            renderHTML += fillTemplate(EVENTS_TO_RENDER[i]);
        }
        calendarElement.innerHTML = renderHTML;
    };

    /*
    * Function responsible for adding new events to `EVENTS_TO_RENDER` array. Also checks validity of input data.
    */
    var addEvents = function (events) {
			console.warn('addEvents[]');
/** /
//console.log('events='+JSON.stringify(events));
console.info('events=');
for ( i=0; i<events.length; i++ ) {
	console.log("\t["+i+']'+JSON.stringify(events[i]));
}
/**/
        var modifiedEvents = 0,
            //in modern browsers caching prototype chain like this doesn't help but in older IE's it still does
            cachedToString = Object.prototype.toString,
            eventsData,
            eventEnd,
            eventStart;

        //today is tuesday so I choose this method of testing Array/Object
        if (cachedToString.call(events) === "[object Array]"){
            eventsData = events;
        } else if (cachedToString.call(events) === "[object Object]"){
            eventsData = [];
            eventsData.push(events);
        } else {
            throw 'Wrong data type';
        }
/** /
//console.log('eventsData='+JSON.stringify(eventsData));
console.info('eventsData=');
for ( i=0; i<eventsData.length; i++ ) {
	console.log("\t["+i+']'+JSON.stringify(eventsData[i]));
}
/**/
        for (var i=0, l=eventsData.length; i<l; i+=1){
            eventTitle = eventsData[i].title;
            eventStart = eventsData[i].start;
            eventEnd   = eventsData[i].end;

            //check if event object has the required properties. I'm skipping test for numerical value.
            if (eventStart !== null && eventEnd !== null && eventStart < eventEnd && 
                eventStart >= 0 && eventEnd <= 720){

                //creating new object in case the original had any additional properties
                EVENTS_TO_RENDER.push({
                    title : eventTitle,
                    start : eventStart,
                    end   : eventEnd,
                    position : EVENTS_TO_RENDER.length
                });
                modifiedEvents = 1;
            }
        }
//console.log('EVENTS_TO_RENDER='+JSON.stringify(EVENTS_TO_RENDER));
console.info('EVENTS_TO_RENDER=');
for ( index=0; index<EVENTS_TO_RENDER.length; index++ ) {
	console.log("\t["+index+']'+JSON.stringify(EVENTS_TO_RENDER[index]));
}
        //we don't want to refresh the DOM if nothing changed
        if (modifiedEvents){
            getEventsOverlapping();
            prepareRenderData();
            renderEvents();

            return true;
        }
        //return value tells us if the view was refreshed
        return false;
    };

    //we need this function in the global scope
    window.addEvents = addEvents;
})();

//as required in the doc
function layOutDay (events) {
    return addEvents(events);
}
