// get the latitude and longitude from the browser
const successCallback = (position) => {
    console.log(position);
};
  
const errorCallback = (error) => {
    console.log(error);
};
  
var grid = navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
console.log(grid);
// get the place name from the OpenStreetMap API

// get the weather from the NOAA API


function FahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function updateDisplay(loc, citycode, cond, icon, temp, hi, lo, alertText, smarmyText) {
    // update the display with the new data
    // use innerText instead of innerHTML to avoid XSS attacks
    var img = document.getElementById("icon");
    img.src = "./img/svg/" + icon + ".svg";
    document.getElementById("location").innerText = loc;
    document.getElementById("conditions").innerText = cond;
    // image icon
    document.getElementById("temp").innerText = temp + "ºF";
    document.getElementById("hilo").innerText = "High: " + hi + "ºF • Low: " + lo + "ºF";
    document.getElementById("alert").innerText = alertText;
    document.getElementById("smarmy").innerText = smarmyText;
}

