/**
 * Ad Numerare Dierum
 * Returns current Julian Date UTC +1
 * Shows current Beat Time
 * A fun time measuring project
 * JL Hoover 2459270
 * Converted to Typescript 2459417
 */
"use strict";

//---------------------------------------------------------
import {
  getDayName,
  getJulianDay,
  initToggleButton,
} from "./shared_functions.js";

// --------------------------------------------------------
const getMeliaName = (index: number): string => {
  return [
    "Nullamelia",
    "Unumelia",
    "Duomelia",
    "Triamelia",
    "Quattarmelia",
    "Quinquemelia",
    "Sesmelia",
    "Septmelia",
    "Octomelia",
    "Novemelia",
  ][index];
};

// --------------------------------------------------------
function getBeats(): string {
  const secondsPerBeat = 86.4;

  let time = new Date();
  let seconds = time.getUTCSeconds(),
    minutes = time.getUTCMinutes(),
    hours = time.getUTCHours();

  // correct for Central European Standard -> UTC + 1
  if (hours === 23) {
    hours = 0;
  } else {
    hours++;
  }

  let secondsSoFar = convertToSeconds(hours, minutes, seconds);

  // convert to beats - next 4 lines separated for clarity

  // chop excessive precision
  let internetTime = (secondsSoFar / secondsPerBeat).toFixed(2);
  // pad with leading zeros
  internetTime = "000" + internetTime;
  // cut to correct length - start rightmost
  internetTime = internetTime.slice(-6);
  // add the @
  internetTime = "@" + internetTime;

  return internetTime;
}

// --------------------------------------------------------
function convertToSeconds(
  hours: number,
  minutes: number,
  seconds: number
): number {
  return (hours * 60 + minutes) * 60 + seconds;
}

// --------------------------------------------------------
function sliceJD(ND: number): string[] {
  // extract elements from the JD for ND
  let triennium = ND.toString().slice(0, 4);
  let melia = ND.toString().slice(4, 5);
  let centum = ND.toString().slice(5, 7);

  return [triennium, melia, centum];
}

// --------------------------------------------------------
function showNumerareDierum(
  triennium: string,
  melia: number,
  centum: string,
  thebeats: string,
  dotw: string
): void {
  const output = document.querySelector(".output") as HTMLParagraphElement;
  const jd = document.querySelector(".jd") as HTMLParagraphElement;

  output.innerHTML = `Now: <span class="green"> ${dotw} ${centum}${getOrdinalIndicator(
    parseInt(centum)
  )} ${getMeliaName(melia)} ${triennium} ${thebeats}</span>`;
  jd.innerHTML = `Julian Date: <span class="green">${triennium}${melia}${centum}</span>`;
}

// --------------------------------------------------------
function addDatePicker(): void {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();

  // input control requires leading zeros
  let monthstr = "";
  if (month < 10) {
    monthstr = month.toString().padStart(2, "0");
  } else {
    monthstr = month.toString();
  }

  let datestr = "";
  if (date < 10) {
    datestr = date.toString().padStart(2, "0");
  } else {
    datestr = date.toString();
  }

  let datePicker = document.getElementById("date-picker") as HTMLInputElement;
  datePicker.value = `${year}-${monthstr}-${datestr}`;

  datePicker.addEventListener("change", (event) => {
    // selectedDate is 00:00 UTC, not local time
    let selectedDate = new Date();
    if (event.target != null) {
      let eventTarget = <HTMLInputElement>event.target;
      selectedDate = new Date(eventTarget.value);
    }
    let year = selectedDate.getUTCFullYear();
    let month = selectedDate.getUTCMonth() + 1;
    let date = selectedDate.getUTCDate();

    let ND = getJulianDay(date, month, year);

    let [triennium, melia, centum] = sliceJD(ND);
    let dotw = getDayName((ND + 1) % 7);

    const output = document.querySelector(
      ".selected-date-output"
    ) as HTMLParagraphElement;
    output.style.visibility = "visible";

    output.innerHTML = `Then: <span class="green">(${ND}) ${dotw} ${centum}${getOrdinalIndicator(
      parseInt(centum)
    )} ${getMeliaName(parseInt(melia))} ${triennium}</span>`;
  });
}

// --------------------------------------------------------
function getOrdinalIndicator(number: number): string {
  // adds st, nd, rd or th to number
  let rightmostDigit = number.toString().slice(-1);
  let ordinalIndicator = "";

  // in English, 11 - 13 are exceptions to the rule
  if (number >= 11 && number <= 13) {
    ordinalIndicator = "th";
  } else if (parseInt(rightmostDigit) < 1 || parseInt(rightmostDigit) >= 4) {
    ordinalIndicator = "th";
  } else if (parseInt(rightmostDigit) === 1) {
    ordinalIndicator = "st";
  } else if (parseInt(rightmostDigit) === 2) {
    ordinalIndicator = "nd";
  } else if (parseInt(rightmostDigit) === 3) {
    ordinalIndicator = "rd";
  }

  return ordinalIndicator;
}

// --------------------------------------------------------
function getUTCdate(): number[] {
  // returns current julian date, offset UTC+1 tho
  let today = new Date();
  let year = today.getUTCFullYear(),
    month = today.getUTCMonth() + 1,
    date = today.getUTCDate(),
    hour = today.getUTCHours();

  // correct for Central European Standard Time so that
  // date is incremented at 11pm
  if (hour === 23) {
    date++;
  }

  return [year, month, date];
}

// --------------------------------------------------------
function ndmain(): void {
  let [year, month, date] = getUTCdate();
  let ND = getJulianDay(date, month, year);

  let thebeats = getBeats();
  let [triennium, melia, centum] = sliceJD(ND);
  let dotw = getDayName((ND + 1) % 7);

  showNumerareDierum(triennium, parseInt(melia), centum, thebeats, dotw);
}

// --------------------------------------------------------
initToggleButton();
ndmain();
setInterval(ndmain, 1000);
addDatePicker();
