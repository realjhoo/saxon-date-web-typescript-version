/*
NOTES
RE
Current Table = runicyear % 19

Itercalary Year
result = ((runicyear*7)+1) % 19
     if result <= 6 year is intercalary
     if result >6 year is normal
     (3, +6, 8, +11, 14, +17, 19)
     +# means 385 days, else 384


     IDEA
     Determine the runic year
     GENERATE the table for that year!!!
     Use table to find current date
*/
// typescript web version
"use strict";

//---------------------------------------------------------
import {
  getDayName,
  getJulianDay as getJulianDate,
  initToggleButton,
  getSaxonMonthName,
} from "./shared_functions.js";

// --------------------------------------------------------
function isDST(date: Date): boolean {
  // DST means Daylight Savings Time
  let jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) != date.getTimezoneOffset();
}

// --------------------------------------------------------
function getDayNumber(date: Date): number {
  // returns 1-366 (day of the year)
  // corrects for Daylight Savings Time
  let DST = isDST(date);
  if (DST) {
    return Math.ceil(
      (+date - +new Date(date.getFullYear(), 0, 1, -1, 0, 0, 0)) / 86400000
    );
  } else {
    return Math.ceil(
      (+date - +new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0)) / 86400000
    );
  }
}

// --------------------------------------------------------
function getRunicYear(saxonMonth: string, gregorianDate: Date): number {
  // change: add 252 to current gregorian year to get the Runic Era (RE)
  const January = 1;
  const December = 12;
  let gregorianYear = gregorianDate.getFullYear();
  let gregorianMonth = gregorianDate.getMonth() + 1;
  let saxonYear = 0;

  if (saxonMonth === "Ereyule" && gregorianMonth === January) {
    saxonYear = gregorianYear + 251;
  } else if (saxonMonth === "Afteryule" && gregorianMonth === December) {
    saxonYear = gregorianYear + 253;
  } else {
    saxonYear = gregorianYear + 252;
  }
  return saxonYear;
}

// --------------------------------------------------------
function getGoldenNumber(year: number): number {
  // runic year mod 19 (is this doable with daynumbers???)
  return (year % 19) + 1;
}

// --------------------------------------------------------
function showSaxonDate(saxonDate: string): void {
  let output = document.querySelector(".saxon-date") as HTMLParagraphElement;
  output.innerHTML = saxonDate;
}

// --------------------------------------------------------
function getFirstDay(monthStart: number, gregorianYear: number): number {
  // finds day of week of 1st day of lunar month
  let jd = getJulianDate(0, 1, gregorianYear) + monthStart;
  let dowNumber = (jd + 1) % 7;
  return dowNumber;
}

// --------------------------------------------------------
function getSaxonDate(metonicData: object): void {
  // let gregorianToday = new Date("2022-12-24");
  let gregorianToday = new Date();
  let gregorianYear = gregorianToday.getFullYear();
  let goldenNumber = getGoldenNumber(gregorianYear);
  let dayNumber = getDayNumber(gregorianToday);

  let i = 0;
  let monthStart = 0;
  let monthLength = 0;
  let saxonMonthNum = 0;
  let length = Object.keys(
    eval(`metonicData.MetonicTable${goldenNumber}`)
  ).length;

  while (
    eval(`metonicData.MetonicTable${goldenNumber}[i].Start`) <= dayNumber
  ) {
    monthLength = eval(`metonicData.MetonicTable${goldenNumber}[i].Stop`);
    monthStart = eval(`metonicData.MetonicTable${goldenNumber}[i].Start`);
    saxonMonthNum = parseInt(
      eval(`metonicData.MetonicTable${goldenNumber}[i].moon`)
    );

    // the = was removed when the Ereyule date ran to 32 days. This may cause a future error??? 24 Dec 20222
    //   if (i >= length - 1) {
    i++;
    if (i > length - 1) {
      break;
    }
  }

  let day = getDayName(gregorianToday.getDay());
  let saxonDay = dayNumber - monthStart + 1;
  let saxonMonth = getSaxonMonthName(saxonMonthNum);

  let runicYear = getRunicYear(saxonMonth, gregorianToday);

  let saxonDate = `${day} ${saxonDay} ${saxonMonth} ${runicYear}`;

  showSaxonDate(saxonDate);

  let firstDay = getFirstDay(monthStart, gregorianYear);

  showCalendar(monthLength, firstDay, runicYear, saxonMonth, saxonDay);

  // *** SOME LOG OUTS ***
  console.clear();
  console.log("%cOutput Follows:", "color: lightgreen");
  console.log(gregorianToday);
  console.log(`Daylight Savings Time is ${isDST(gregorianToday)}`);
  console.log(`Golden Number: ${goldenNumber}`);
  console.log("Today's Day Number", dayNumber);
  console.log("Month Start: ", monthStart);
  console.log("Length of Month: ", monthLength);
  console.log(`Today is a ${day}`);
  console.log(`Saxon Day: ${saxonDay}`);
  console.log(`Saxon Month: ${saxonMonth}`);
  console.log(`Saxon Year: ${runicYear}`);
  console.log(`Saxon Date: ${saxonDate}`);
}

// --------------------------------------------------------
function showCalendar(
  daysInMonth: number,
  firstDay: number,
  saxonYear: number,
  saxonMonth: string,
  saxonDay: number
): void {
  // tbody and h3
  const calendarBody = document.getElementById("calendar-body")!;
  const monthYear = document.getElementById("month-year")!;

  // clear previous cells and set the calendar title
  calendarBody.innerHTML = "";
  monthYear.innerHTML = `${saxonMonth} ${saxonYear}`;

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        const cell = document.createElement("td");
        const cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > daysInMonth) {
        break;
      } else {
        const cell = document.createElement("td");
        const cellText = document.createTextNode(date.toString());
        if (date === saxonDay) {
          cell.classList.add("highlight-cell");
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
        date++;
      }
    }

    calendarBody.appendChild(row);
  }
}

// --------------------------------------------------------
function getMetonicData(): void {
  fetch("js/data/metonicTables.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let metonicData = data;
      getSaxonDate(metonicData);
    });
}

// --------------------------------------------------------
function main(): void {
  initToggleButton();
  getMetonicData();
  setInterval(() => {
    let now = new Date();
    let minutes = now.getMinutes();
    if (minutes === 0) {
      getMetonicData();
    }
  }, 60000);
}

// --------------------------------------------------------
main();
