import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Components/Header.js";
import { Route, Switch } from "react-router-dom";
import WalkForm from "./Components/WalkForm.js";
import WalkList from "./Components/WalkList.js";
import CityForm from "./Components/CityForm.js";
import Response from "./Components/Response.js";
import ResponseRainy from "./Components/ResponseRainy.js";
import ResponseNight from "./Components/ResponseNight.js";
import ChangeBackground from "./Components/ChangeBackground.js";
import { useHistory } from "react-router-dom";

//Gets the baseurl and apikey from the process env
const BASEURL = "http://api.weatherapi.com/v1";
const API_KEY = "05d2e662aca243ef99c223826210402";

function App() {
  let [error, setError] = useState(null);
  let [forecast, setForecast] = useState(null);
  let [walks, setWalks] = useState([]);
  let history = useHistory();

  //calls the getWalks function as an effect of opening the app
  useEffect(() => {
    getWalks();
  }, []);

  //function to get the walks from the database
  const getWalks = () => {
    fetch("/walks")
      .then(result => result.json())
      .then(walks => {
        setWalks(walks);
      })
      .catch(error => {
        console.log(error);
      });
  };

  //Deletes walks from the database
  function deleteWalk(id) {
    console.log("Delete walk console log" + id);
    let options = {
      method: "DELETE"
      // body: JSON.stringify(walks)
    };

    fetch(`/walks/${id}`, options)
      .then(result => result.json())
      .then(walks => {
        setWalks(walks);
      })
      .catch(err => {
        console.log("error!", err.message);
      });
  }

  //Adds a walk to the database
  function addWalk(title, date, time) {
    let newWalk = { title, date, time };
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      //this tells the server in what format to expect the data
      body: JSON.stringify(newWalk) //object needs to converted to json (with stringify)
    };
    fetch("/walks", options)
      .then(result => result.json())
      .then(walks => {
        setWalks(walks);
      })
      .catch(err => {
        console.log("error!", err.message);
      });
  }

  //gets the weather from the API
  const getWeather = async location => {
    console.log("location -->", location);
    let url = `${BASEURL}/forecast.json?key=${API_KEY}&q=${location}&days=1`;
    // sets the url for the query
    setForecast(null);
    //resets to null

    try {
      console.log(url);
      let response = await fetch(url);

      // call fetch, wait for return
      if (response.ok) {
        console.log("Response ok");
        // server received and understood the request
        let data = await response.json();
        setForecast(data); //update state
      } else {
        console.log("Run into an error");
        setError(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.log("Ended up in catch");
      setError(`Network error: ${err.message}`);
    }
  };

  //Get 2 days of weather for nightmode
  const getWeather2 = async location => {
    console.log("location -->", location);
    let url = `${BASEURL}/forecast.json?key=${API_KEY}&q=${location}&days=2`;
    // sets the url for the query
    setForecast(null);
    //resets to null

    try {
      console.log(url);
      let response = await fetch(url);

      // call fetch, wait for return
      if (response.ok) {
        console.log("Response ok");
        // server received and understood the request
        let data = await response.json();
        setForecast(data); //update state
      } else {
        console.log("Run into an error");
        setError(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.log("Ended up in catch");
      setError(`Network error: ${err.message}`);
    }
  };

  //to consider in the future: it behaves slightly different than href

  // function changeRoute(route) {
  //   if (route === "rainy") {
  //     history.push("/rainy");
  //   }
  //   else if (route === "night") {
  //     history.push("/night");
  //   }
  //   else if (route === "sunny") {
  //     history.push("/");
  //   }
  // }

  //for it to work, must include a handleclick on the <a> tags of the dropwdown, like this:
  //onClick={() => changeRoute("sunny")}

  return (
    <div className="App">
      <Header />

      <br></br>

      <div class="dropdown show">
        <a
          class="btn btn-secondary dropdown-toggle"
          href="#"
          role="button"
          id="dropdownMenuLink"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Choose your mood
        </a>

        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a class="dropdown-item" href="/night">
            Rainy mood
          </a>
          <a class="dropdown-item" href="/night">
            Night mode
          </a>
          <a class="dropdown-item" href="/">
            Sunny walk
          </a>
        </div>
      </div>

      <Switch>
        {/*Sunny path - deafult*/}
        {/* Using 'exact' else route will match everything */}
        <Route path="/" exact>
          <ChangeBackground mood="sunny" />
          <CityForm onSubmit={location => getWeather(location)} />
          {forecast && <Response forecast={forecast} />}
          <br></br>
        </Route>

        {/*Rainy path*/}
        <Route path="/rainy" exact>
          <ChangeBackground mood="rainy" />
          <CityForm onSubmit={location => getWeather(location)} />
          {forecast && <ResponseRainy forecast={forecast} />}
          <br></br>
        </Route>

        {/*Night path*/}
        <Route path="/night" exact>
          <ChangeBackground mood="night" />
          <CityForm onSubmit={location => getWeather2(location)} />
          {forecast && <ResponseNight forecast={forecast} />}
          <br></br>
        </Route>

        {/*My Walks path*/}
        <Route path="/mywalks">
          <ChangeBackground mood="mywalks" />
          <WalkForm
            onSubmit={(title, date, time) => addWalk(title, date, time)}
          />
          <WalkList walks={walks} onDelete={id => deleteWalk(id)} />
        </Route>
      </Switch>
    </div>
  );
}
export default App;
