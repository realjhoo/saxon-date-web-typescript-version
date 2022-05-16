// --------------------------------------------------------
export const getDayName = (index: number): string => {
  return [
    "Sunnandaeg",
    "Monandaeg",
    "Tiwesdaeg",
    "Wodnesdaeg",
    "Thunresdaeg",
    "Frigedaeg",
    "Saeternesdaeg",
  ][index];
};

// --------------------------------------------------------
export const getSaxonMonthName = (index: number): string => {
  return [
    "Afteryule",
    "Solmonath",
    "Hrethmonath",
    "Eastermonath",
    "Thrimilce",
    "Erelitha",
    "Afterlitha",
    "Trilitha",
    "Weedmonath",
    "Haligmonath",
    "Winterfylleþ",
    "Blotmonath",
    "Ereyule",
  ][index];
};

// --------------------------------------------------------
export function getJulianDay(
  date: number,
  month: number,
  year: number
): number {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let JD =
    date +
    Math.floor((153 * m + 2) / 5) +
    y * 365 +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  return JD;
}

//---------------------------------------------------------
export function initToggleButton() {
  let button = document.querySelector("#toggle-button") as HTMLButtonElement;
  button.addEventListener("click", () => {
    toggleit();
  });
}

// --------------------------------------------------------
function toggleit() {
  // toggles visibility of explainer in DOM - obviously
  const toggleButton = document.getElementById(
    "toggle-button"
  ) as HTMLButtonElement;
  const explainer = document.querySelector(".explainer") as HTMLDivElement;

  if (toggleButton.innerHTML === "Show More") {
    toggleButton.innerHTML = "Show Less";
    explainer.style.display = "block";
  } else {
    toggleButton.innerHTML = "Show More";
    explainer.style.display = "none";
  }
}
