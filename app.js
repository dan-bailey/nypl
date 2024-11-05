// DATA
let userLocation = {
    latitude: null,
    longitude: null
};

// SET UP CURRENT CITIES

var current = {
    latitude: 0,
    longitude: 0,
    observationstation: "",
    placename: "",
    citycode: "generic",
    conditions: "",
    iconfilename: "",
    temp: CelsiusToFahrenheit(0),
    high: 0,
    low: 0,
    alert: null,
    smarmy: ""
}

var nyc = {
    latitude: 40.7128,
    longitude: -74.0060,
    observationstation: "",
    placename: "New York, NY",
    citycode: "nyc",
    conditions: "Fog",
    iconfilename: "fog",
    temp: 47,
    high: 52,
    low: 34,
    alert: "Stuff!",
    smarmy: "We got your weather right here!"    
}

var sydney = {
    latitude: -33.8688,
    longitude: 151.2093,
    observationstation: "",
    placename: "Sydney, NSW",
    citycode: "sydney",
    conditions: "",
    iconfilename: "",
    temp: 0,
    high: 0,
    low: 0,
    alert: null,
    smarmy: ""    
}

var london = {
    latitude: 51.5072,
    longitude: -0.1276,
    observationstation: "",
    placename: "London, UK",
    citycode: "london",
    conditions: "",
    iconfilename: "",
    temp: 0,
    high: 0,
    low: 0,
    alert: null,
    smarmy: ""     
}

var indianapolis = {
    latitude: 39.7691,
    longitude: -86.1580,
    observationstation: "",
    placename: "Indianapolis, IN",
    citycode: "indianapolis",
    conditions: "",
    iconfilename: "",
    temp: 0,
    high: 0,
    low: 0,
    alert: null,
    smarmy: ""
}    



// FUNCTIONS

function CelsiusToFahrenheit(c) {
    const F = (c * (9 / 5)) + 32;
    return F;
}

function updateDisplay(obj) {
    // update the display with the new data
    // use innerText instead of innerHTML to avoid XSS attacks
    var img = document.getElementById("icon");
    img.src = "./img/svg/" + self.iconfilename + ".svg";
    document.getElementById("location").innerText = obj.placename;
    document.getElementById("conditions").innerText = obj.conditions;
    document.getElementById("temp").innerText = temp + "ºF";
    document.getElementById("hilo").innerText = "High: " + obj.high + "ºF • Low: " + obj.low + "ºF";
    document.getElementById("alert").innerText = obj.alert;
    document.getElementById("smarmy").innerText = obj.smarmy;
}

function setError(city) {
    city.placename = "Geolocation Error";
    city.conditions = "Error!";
    city.iconfilename = "sunny";
    city.citycode = "generic";
    city.temp = 0;
    city.high = 0;
    city.low = 0;
    city.alert = "There was an error in retrieving the observation station ID.";
    city.smarmy = "You're on your own!";
}

function completeCity(obj) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // record lat and long
            if (obj.latitude == 0) {
                obj.latitude = position.coords.latitude;
                obj.longitude = position.coords.longitude;
            }
            // use weather.gov API to get the city name and observation station
            if (obj.placename == "") {
                fetch("https://api.weather.gov/points/" + obj.latitude + "," + obj.longitude)
                .then(response => response.json())
                .then(data => {
                    obj.observationstation = data.properties.observationStations;
                    obj.placename = data.properties.relativeLocation.properties.city + ", " + data.properties.relativeLocation.properties.state;
                })
                .catch(error => {
                    obj.conditions = "Error!";
                    obj.iconfilename = "sunny";
                    obj.citycode = "generic";
                    obj.temp = 0;
                    obj.high = 0;
                    obj.low = 0;
                    obj.alert = "There was an error in retrieving the observation station ID.";
                    obj.smarmy = "You're on your own!";
                });
            }
            // use observation station to get current conditions
          },
          (error) => {
            setError(obj);
          }
        );
      } else {
        setError(obj);
      }
}




// SET UP SOME VARIABLES
completeCity(current);

console.log(current);