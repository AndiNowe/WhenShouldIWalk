import React from "react";

function Response(props) {
  let w = props.forecast;

  // *** INITIAL FETCH FOR AN ARRAY OF HOURS
  let unfilteredHours = Object.entries(w.forecast.forecastday[0].hour); // first fetch of all hours

  //**FINDS DAYLIGHT HOURS */
  let sunsetHour =
    Number(w.forecast.forecastday[0].astro.sunset.slice(0, 2)) + 12; // finds and converts sunset
  let sunriseHour = Number(w.forecast.forecastday[0].astro.sunrise.slice(0, 2)); //finds and converts sunset hours

  // **FINDS START TIME ***
  let startTime = null;
  let optimumTime = ""; // optimum time needs to be defined as early as here because of the base case
  let timeOfAccess = Number(w.location.localtime.slice(11, -3)); //Time the person accessed the website
  timeOfAccess < sunriseHour
    ? (startTime = sunriseHour)
    : (startTime = timeOfAccess); // if time of access if before sunrise, start time is sunrise hour.
  if (timeOfAccess > sunsetHour) optimumTime = "Tomorrow"; // if time of access is after sunset, optimal time is tomorrow
  let sunnyHours = []; //these are the sunny hours in a day
  for (let i = 0; i < unfilteredHours.length; i++) {
    if (i > startTime && i < sunsetHour) sunnyHours.push(unfilteredHours[i]);
  }

  console.log("sunny hours " + sunnyHours);
  console.log("sunny hours stringified " + JSON.stringify(sunnyHours));
  console.log("sunny hours ZERO " + sunnyHours[0]);
  console.log("sunny hours ZERO TYPE " + typeof sunnyHours);

  /***FINDS DRY HOURS***/
  //pushes the sunny hours to either a dryHours or rainyDayHours array
  let dryHours = []; //these are dry hours in a day
  let rainyDayHours = []; //hours to use on a rainy day (all)
  for (let i = 0; i < sunnyHours.length; i++) {
    for (let j = 0; j < sunnyHours[i].length; j++) {
      if (sunnyHours[i][j].will_it_rain === 0) {
        dryHours.push(sunnyHours[i]);
      }
    }
  }
  // *** IF NO DRY HOURS, ALL HOURS ARE "ELIGIBLE" HOURS***//
  if (dryHours.length === 0) rainyDayHours = sunnyHours;

  //**** SORTS HOURS INTO TEMERATURE TYPE *** //
  let comfortableTemp = [];
  let coldTemp = [];
  let rainyCold = [];
  let rainyHot = [];
  let rainyComfortable = [];
  let veryHot = [];

  if (rainyDayHours.length === 0) {
    //if not going to rain all day
    for (let i = 0; i < dryHours.length; i++) {
      // loop through dry hours array to find right hour
      for (let j = 0; j < dryHours[i].length; j++) {
        if ((dryHours[i][j].temp_c > 10) & (dryHours[i][j].temp_c <= 20)) {
          comfortableTemp.push(dryHours[i]); // if temp between 10 and 20, push to comfortable array
        } else if (dryHours[i][j].temp_c < 10) {
          coldTemp.push(dryHours[i]); // if temp less than 10, push to coldtemp array
        } else if (dryHours[i][j].temp_c > 20) {
          veryHot.push(dryHours[i]); // if temp more than 20, push to veryhot array
        }
      }
    }
  } else {
    //if whole day is rainy
    for (let i = 0; i < rainyDayHours.length; i++) {
      for (let j = 0; j < rainyDayHours[i].length; j++) {
        if (
          (rainyDayHours[i][j].temp_c > 10) &
          (rainyDayHours[i][j].temp_c <= 20)
        ) {
          rainyComfortable.push(rainyDayHours[i]); //push temps between 10 and 20 to rainycomfortable
        } else if (rainyDayHours[i][j].temp_c <= 10) {
          rainyCold.push(rainyDayHours[i]); // push temps <= 10 to rainycold
        } else if (rainyDayHours[i][j].temp_c > 20) {
          rainyHot.push(rainyDayHours[i]); // push temps > 20 to rainyhot
        }
      }
    }
  }

  /***SORT TEMP ARRAYS BY A CONDITION ***/

  let sortTemps = (oldArray, value, direction) => {
    let newArray = oldArray.sort(function(a, b) {
      switch (value) {
        case "wind_mph":
          if (direction === "low-high") {
            return a[1].wind_mph - b[1].wind_mph;
          } else return b[1].wind_mph - a[1].wind_mph;
        case "temp_c":
          if (direction === "low-high") {
            return a[1].temp_c - b[1].temp_c;
          } else return b[1].temp_c - a[1].temp_c;
        case "humidity":
          if (direction === "low-high") {
            return a[1].humidity - b[1].humidity;
          } else return b[1].humidity - a[1].humidity;
        case "totalprecip_mm":
          if (direction === "low-high") {
            return a[1].totalprecip_mm - b[1].totalprecip_mm;
          } else return b[1].totalprecip_mm - a[1].totalprecip_mm;
      }
    });
    return newArray;
  };
  // uses the above function to sort all the temperatures in each array.
  let sortedComfortableTemp = sortTemps(
    comfortableTemp,
    "humidity",
    "low-high"
  );
  let sortedVeryHot = sortTemps(veryHot, "wind_mph", "high-low");
  let sortedCold = sortTemps(coldTemp, "wind_mph", "low-high");
  let sortedRainyCold = sortTemps(rainyCold, "totalprecip_mm", "low-high");
  let sortedRainyHot = sortTemps(rainyHot, "temp_c", "low-high");
  let sortedRainyComfortable = sortTemps(
    rainyComfortable,
    "totalprecip_mm",
    "low-high"
  );

  // ** FINDS OPTIMUM TIME ** //
  let weatherConditionsAtTime = ""; // weather conditions at time of walk
  let icon = "";
  //temp
  let temperatureAtTime = "";
  //functino to find the optimum time
  let findTime = arrayToCheck => {
    if (Number(arrayToCheck[0][0]) > 12) {
      optimumTime = Number(arrayToCheck[0][0] - 12) + ".00 p.m.";
    } else if (Number(arrayToCheck[0][0]) === 12) {
      optimumTime = Number(arrayToCheck[0][0]) + ".00 p.m.";
    } else {
      optimumTime = Number(arrayToCheck[0][0]) + ".00 a.m.";
    }
    weatherConditionsAtTime =
      "Weather at this time:  " +
      arrayToCheck[0][1].condition.text.toLowerCase(); //sets weather conditions
    icon = arrayToCheck[0][1].condition.icon; //sets icon

    temperatureAtTime =
      "Estimated temperature:  " + arrayToCheck[0][1].temp_c + "ºC"; //sets weather conditions
  };

  //uses above function to find the optimum time by going through arrays in the following order:
  if (sortedComfortableTemp.length > 0) {
    findTime(sortedComfortableTemp);
  } else if (sortedCold.length > 0) {
    findTime(sortedCold);
  } else if (sortedVeryHot.length > 0) {
    findTime(sortedVeryHot);
  } else if (sortedRainyComfortable.length > 0) {
    findTime(sortedRainyComfortable);
  } else if (sortedRainyHot.length > 0) {
    findTime(sortedRainyHot);
  } else if (sortedRainyCold.length > 0) {
    findTime(sortedRainyCold);
  } else if (timeOfAccess < sunsetHour) {
    optimumTime = "Now"; // if none of the arrays have values, and time of access is before sunset, then
    //the time is in the last hour before sunset. So people will need to get out now.
  } else if (timeOfAccess === sunsetHour) {
    optimumTime = "Tomorrow"; // best time is tomorrow if access time is after sunset
  }
  // *** DEFINES A LATE MESSAGE *** //
  let lateMessage = "";
  if (optimumTime === "Tomorrow") lateMessage += "It's already dark.";
  if (optimumTime === "Now")
    lateMessage += "Get out quickly. It'll be dark within the hour.";
  if (optimumTime !== "Tomorrow" || optimumTime === "Now") {
    return (
      // This is the final response if a time is shown
      <div className="Response">
        <p>
          <h1 id="location">
            {w.location.name}, {w.location.country}
          </h1>
          The best time for your walk is<br></br>
          <span id="time">{optimumTime} </span>
        </p>
        <p>
          <img id="icon" src={icon} />
          <br></br>
          {weatherConditionsAtTime}
          <br></br>
          {temperatureAtTime}
        </p>
      </div>
    );
  } else {
    return (
      // This is the final response if "tomorrow" is shown
      <div className="Response">
        <p>
          <h1 id="location">
            {w.location.name}, {w.location.country}{" "}
          </h1>{" "}
          The best time for your walk is<br></br>
          <span id="time">{optimumTime} </span>
          <br></br> {lateMessage}
        </p>
        <p></p>
      </div>
    );
  }
}

export default Response;
