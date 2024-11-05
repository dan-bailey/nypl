// DATA
const localButton = document.getElementById("local");
const nycButton = document.getElementById("nyc");
const londonButton = document.getElementById("london");
const sydneyButton = document.getElementById("sydney");
const indianapolisButton = document.getElementById("indianapolis");


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
    conditions: "",
    iconfilename: "",
    temp: 0,
    high: 0,
    low: 0,
    alert: null,
    smarmy: ""    
}

var sydney = {
    latitude: -33.8688,
    longitude: 151.2093,
    observationstation: "",
    placename: "Sydney, NSW",
    citycode: "sydney",
    conditions: "Sunny",
    iconfilename: "sunny",
    temp: 105,
    high: 200,
    low: 104,
    alert: null,
    smarmy: "Now you know what it feels like to be creamated."    
}

var london = {
    latitude: 51.5072,
    longitude: -0.1276,
    observationstation: "",
    placename: "London, UK",
    citycode: "london",
    conditions: "Rain",
    iconfilename: "rain",
    temp: 48,
    high: 49,
    low: 44,
    alert: null,
    smarmy: "About normal, innit?"     
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
    return Math.round(F);
}



function updateDisplay(obj) {
    // update the display with the new data
    // use innerText instead of innerHTML to avoid XSS attacks
    var img = document.getElementById("icon");
    img.src = "./img/svg/" + obj.iconfilename + ".svg";

    var bg = document.getElementById("backdrop");
    var newImgURL = "url('./img/" + obj.citycode + "/" + obj.iconfilename + ".jpg')";
    console.log("**** New Backdrop: " + newImgURL);
    bg.style.backgroundImage = newImgURL;
    document.getElementById("location").innerText = obj.placename;
    document.getElementById("conditions").innerText = obj.conditions;
    document.getElementById("temp").innerText = obj.temp + "ºF";
    document.getElementById("hilo").innerText = "High: " + obj.high + "ºF • Low: " + obj.low + "ºF";
    document.getElementById("alert").innerText = "Alert functions disabled.";
    document.getElementById("smarmy").innerText = obj.smarmy;
}

function setError(city) {
    city.placename = "Geolocation Error";
    city.conditions = "Error!";
    city.iconfilename = "no";
    city.citycode = "generic";
    city.temp = 0;
    city.high = 0;
    city.low = 0;
    city.alert = "There was an error in retrieving the observation station ID.";
    city.smarmy = "You're on your own!";
}

function setSmarmy(city) {
    // there are so many more of these you could add
    city.smarmy = "It's a beautiful day in the neighborhood!";
    if ((city.citycode == "sydney") && (city.temp > 100)) {
        city.smarmy = "Now you know what it's like to feel like you've been creamated.";
    }
    if ((city.citycode == "nyc") && (city.temp < 32)) {
        city.smarmy = "Gross."
    }
    if (city.citycode == "indianapolis") {
        city.smarmy = "You're in Indy. Every day is the same, regardless of weather.";
    }
}



function buildCity(obj) {
    // Use GeolocationAPI to get the user's latitude and longitude
    navigator.geolocation.getCurrentPosition(function(position) {
        if (obj.latitude == 0) {
            obj.latitude = position.coords.latitude;
            obj.longitude = position.coords.longitude;
        }
        var placeURL = "https://api.weather.gov/points/" + obj.latitude + "," + obj.longitude;
        console.log("Latitude: " + obj.latitude + " Longitude: " + obj.longitude);
        console.log(placeURL);

        fetch(placeURL)
            .then(response => response.json())
            .then(data => {
                console.log('OBJ.PLACENAME: ' + obj.placename);
                if (obj.placename == "") {
                    obj.placename = data.properties.relativeLocation.properties.city + ", " + data.properties.relativeLocation.properties.state;
                }
                obj.observationstation = data.properties.observationStations;
                console.log(obj.observationstation);

                return fetch(obj.observationstation);
            })
            .then(response => response.json())
            .then(data => {
                obj.station = data.features[0].id + "/observations/latest";
                console.log(obj.station);

                return fetch(obj.station);
            })
            .then(response => response.json())
            .then(data => {
                // Process the observation data here
                console.log(data);
                obj.temp = CelsiusToFahrenheit(data.properties.temperature.value);
                if (data.properties.maxTemperatureLast24Hours.value == null) {
                    obj.high = "--";
                } else {
                    obj.high = CelsiusToFahrenheit(data.properties.maxTemperatureLast24Hours.value);
                }
                if (data.properties.minTemperatureLast24Hours.value == null) {
                    obj.low = "--";
                } else {
                    obj.low = CelsiusToFahrenheit(data.properties.minTemperatureLast24Hours.value);
                }
                obj.conditions = data.properties.textDescription;
                obj.iconfilename = data.properties.textDescription.replace(" ", "").toLowerCase();
                console.log("Icon Name, Computed: " + obj.iconfilename);
                setSmarmy(obj);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, function(error) {
        console.error('Error getting geolocation:', error);
    });
} // end buildCity


buildCity(current);
buildCity(nyc);
buildCity(indianapolis);
updateDisplay(london);

// EVENT LISTENERS

localButton.addEventListener("click", function() {
    console.log("Local Clicked");
    updateDisplay(current);
});

nycButton.addEventListener("click", function() {
    console.log("NYC Clicked");
    updateDisplay(nyc);
});

londonButton.addEventListener("click", function() {
    console.log("London Clicked");
    updateDisplay(london);
});

sydneyButton.addEventListener("click", function() {
    console.log("Sydney Clicked");
    updateDisplay(sydney);
});

indianapolisButton.addEventListener("click", function() {
    console.log("Indianapolis Clicked");
    updateDisplay(indianapolis);
});

