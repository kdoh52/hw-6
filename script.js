var current = document.getElementById("currentWeather")

$("#searchCity").on("click", function(event) {
    event.preventDefault();

    var cityName = $("#cityName").val().trim();

    $("#currentWeather").empty();
    currentWeather(cityName);
});

function currentWeather(cityName) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=cc1d7110e10d9b9390a02a70dc1628f5";
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var srcLink = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"

        // console.log("City: " + response.name);
        // console.log("Temperature: " + ((response.main.temp * 9 / 5 - 459.67).toFixed(1)));
        // console.log("Humidity: " + response.main.humidity + "%");
        // console.log("Wind Speed: " + response.wind.speed + " MPH");

        $("<h1>" + response.name + " (" + moment().format('l') + ")" + "</h1>").appendTo(current);
        $("#currentWeather").append('<img id="weatherIcon" src="' + srcLink + '" />')
        // $("<p>" + "Date: " + moment().format('L') + "</p>").appendTo(current);
        $("<p>" + "Temperature: " + (response.main.temp * 9 / 5 - 459.67).toFixed(1) + " °F" + "</p>").appendTo(current);
        $("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>").appendTo(current);
        $("<p>" + "Wind Speed: " + response.wind.speed + " MPH" + "</p>").appendTo(current);

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        getUV(lat, lon);
    });
    
    function getUV(lat, lon) {
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=cc1d7110e10d9b9390a02a70dc1628f5"
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(response) {
            $("<p>" + "UV Index: " + response.value + "</p>").appendTo(current);
        })
    }
}

// function kelvinToFahrenheit(kelvin) {
//     var fahrenheit = kelvin * (9/5) - 459.67;
//     return fahrenheit
// }