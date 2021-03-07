import React from "react";

function ResponseNight(props) {
  let w = props.forecast;

  // *** INITIAL FETCH FOR AN ARRAY OF HOURS
  let unfilteredHoursDay1 = Object.entries(w.forecast.forecastday[0].hour);
  // console.log(unfilteredHoursDay1);
  let unfilteredHoursDay2 = Object.entries(w.forecast.forecastday[1].hour);

  //**FINDS NIGHT HOURS DAY 1*/
  let sunsetHourDay1 =
    Number(w.forecast.forecastday[0].astro.sunset.slice(0, 2)) + 12; // finds and converts sunset
  let sunriseHourDay1 = Number(
    w.forecast.forecastday[0].astro.sunrise.slice(0, 2)
  ); //finds and converts sunrise hours

  //**FINDS NIGHT HOURS DAY 1*/
  let sunsetHourDay2 =
    Number(w.forecast.forecastday[1].astro.sunset.slice(0, 2)) + 12; // finds and converts sunset
  let sunriseHourDay2 = Number(
    w.forecast.forecastday[1].astro.sunrise.slice(0, 2)
  ); //finds and converts sunrise hours

  // **FINDS START TIME ***

  /*** FIND DARK HOURS****/
  let nightHours = []; //these are the night hours of the closest night.

  let optimumTime = ""; // optimum time needs to be defined as early as here because of the base case
  let timeOfAccess = Number(w.location.localtime.slice(11, -3)); //Time the person accessed the website

  if (timeOfAccess > sunriseHourDay1 && timeOfAccess < sunsetHourDay1) {
    let day1ValidHours = unfilteredHoursDay1.slice(
      sunsetHourDay1,
      unfilteredHoursDay1.length
    );
    let day2ValidHours = unfilteredHoursDay2.slice(0, sunriseHourDay2);
    nightHours.push(day1ValidHours, day2ValidHours);
  } else if (timeOfAccess > sunsetHourDay1) {
    let day1ValidHours = unfilteredHoursDay1.slice(
      timeOfAccess,
      unfilteredHoursDay1.length
    );
    let day2ValidHours = unfilteredHoursDay2.slice(0, sunriseHourDay2);
    nightHours.push(day1ValidHours, day2ValidHours);
  } else if (timeOfAccess < sunriseHourDay1) {
    let day1ValidHours = unfilteredHoursDay1.slice(
      timeOfAccess,
      sunriseHourDay1
    );

    nightHours.push(day1ValidHours);
  }

  /***FINDS DRY HOURS***/
  //pushes the sunny hours to either a dryHours or rainyDayHours array
  let dryHours = []; //these are dry hours in a day
  let rainyDayHours = []; //hours to use on a rainy day (all)
  for (let i = 0; i < nightHours.length; i++) {
    for (let j = 0; j < nightHours[i].length; j++) {
      for (let k = 0; k < nightHours[i][j].length; k++)
        if (nightHours[i][j][k].will_it_rain === 0) {
          dryHours.push(nightHours[i][j]);
        }
    }
  }
  // *** IF NO DRY HOURS, ALL HOURS ARE "ELIGIBLE" HOURS***//
  if (dryHours.length === 0) rainyDayHours = nightHours;

  //**** SORTS HOURS INTO TEMERATURE TYPE *** //
  let comfortableTemp = [];
  let coldTemp = [];
  let rainyCold = [];
  let rainyHot = [];
  let rainyComfortable = [];
  let veryHot = [];

  if (rainyDayHours.length === 0) {
    //if not going to rain all night
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
    //if whole night is rainy
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
  } else if (timeOfAccess < sunriseHourDay1) {
    optimumTime = "Now"; // if none of the arrays have values, and time of access is before sunset, then
    //the time is in the last hour before sunset. So people will need to get out now.
  }
  //I might not need this for nightmode
  //   else if (timeOfAccess === sunriseHour) {
  //     optimumTime = "Tomorrow"; // best time is tomorrow if access time is after sunset
  //   }

  // *** DEFINES A LATE MESSAGE *** //
  let lateMessage = "";
  //if (optimumTime === "Tomorrow") lateMessage += "It's already dark.";
  if (optimumTime === "Now")
    lateMessage += "Get out quickly. There'll be daylight within the hour.";
  if (optimumTime !== "Now") {
    return (
      // This is the final response if a time is shown
      <div className="ResponseNight">
        <p>
          <h1 id="location">
            {w.location.name}, {w.location.country}
          </h1>
          The best time for your night walk is<br></br>
          <span id="time">{optimumTime} </span>
        </p>
        <p>
          <img id="icon" src={icon} /> <br></br>
          {weatherConditionsAtTime}
        </p>
      </div>
    );
  } else {
    return (
      // This is the final response if "tomorrow" is shown
      <div className="ResponseNight">
        <p>
          <h1 id="location">
            {w.location.name}, {w.location.country}{" "}
          </h1>{" "}
          The best time for your night walk is<br></br>
          <span id="time">{optimumTime} </span>
          <br></br> {lateMessage}
        </p>
        <p></p>
      </div>
    );
  }
}

export default ResponseNight;
