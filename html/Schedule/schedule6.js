// Schedule/schedule6.js
// For use by Tyson Tvinnereim

//alert("schedule6.js has been successfully included in scheduleclassmeetingform!");

//var scmStartDates = [];
window.onload = initForm;
function initForm() {
    document.getElementById("Schedule_form").onclick = scmFormDTVerify;
    //scmStartDates.push(scmStartDate);
    
}
function scmFormDTVerify() {
    alert("form submitted!");
}

function scmFormStartDateVerify(scmStart, scStart, scEnd) {
    console.log("scmFormStartDateVerify initiated!");
    
    // The following verifies that function getDaysInMonth accounts for 29 days in Feb on leap year.
    console.log("days in Feb 2018 = " + getDaysInMonth(01, 2018));
    console.log("days in Feb 2019 = " + getDaysInMonth(01, 2019));
    console.log("days in Feb 2020 = " + getDaysInMonth(01, 2020));
    console.log("days in Feb 2021 = " + getDaysInMonth(01, 2021));
    console.log("days in Feb 2022 = " + getDaysInMonth(01, 2022));
    console.log("days in Feb 2023 = " + getDaysInMonth(01, 2023));
    console.log("days in Feb 2024 = " + getDaysInMonth(01, 2024));
    //console.log("scmStartDates[0] = " + scmStartDates[0]);
    console.log("scmStartDate from form = " + scmStart);
    console.log("scStart from form  = " + scStart);
    var scStartDate = new Date(scStart);
    var scmStartDate = new Date(scmStart);
    var scEndDate = new Date(scEnd);
    console.log("scStartDate = " + scStartDate);
    console.log("scmStartDate = " + scmStartDate);
    if (scmStartDate >= scStartDate && scmStartDate <= scEndDate) {
        console.log("scmStartDate is valid!")
    } else {
        console.log("scmStartDate falls outside scDate range!");
    }
    
}

function scmFormEndDateVerify() {
    console.log("scmFormEndDateVerify initiated!");
}

function scmFormStartTimeVerify() {
    console.log("scmFormStartTimeVerify initiated!");
}

function scmFormEndTimeVerify() {
    console.log("scmFormEndTimeVerify initiated!");
}

function scmFormDateVerify() {
    console.log("scmFormDateVerify initiated!");
}

// Create date array with valid number of days per month.
// This also accounts for 29 days in Feb on a leap year.
// Param month is an int and is 0 based (Month 0-11).
function getDaysInMonth(month, year) {
     var date = new Date(year, month, 1);
     var days = [];
     while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
     }
     return days;
}