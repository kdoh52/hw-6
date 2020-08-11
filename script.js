// SET UP
var current = document.getElementById("currentWeather");
var forecast = document.getElementById("forecastWeather");
var forecastContainer = document.getElementById("forecastContainer");
var history = document.getElementById("history");
// localStorage.clear()

$("#currContainer").hide();
$("#forecastContainer").hide();

// FILL HISTORY
var storedPlaces = JSON.parse(localStorage.getItem("storedPlaces"));
if (storedPlaces !== null) {
    historyText = storedPlaces;
    console.log(historyText);
    var toAdd = document.createDocumentFragment();
    for (i = 0; i < historyText.length; i++) {
        var link = document.createElement("p");
        link.textContent = historyText[i];
        link.className = "history-link";
        toAdd.appendChild(link);
    }
    $("#history").append(toAdd);
}
else {
    historyText = [""]
    // historyText = new Array;
};

// SEARCH BUTTON
$("#searchCity").on("click", function(event) {
    event.preventDefault();
    
    var cityName = $("#cityName").val().trim();
    
    $("#currContainer").show();
    $("#forecastContainer").show();
    $("#currentWeather").empty();
    $("#forecastWeather").empty();
    currentWeather(cityName);
    forecastWeather(cityName);
});

// GET CURRENT WEATHER
function currentWeather(cityName) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=cc1d7110e10d9b9390a02a70dc1628f5";
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var srcLink = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
        
        $("<h1>" + response.name + " (" + moment().format('l') + ")" + "</h1>").appendTo(current);
        $("#currentWeather").append('<img id="weatherIcon" src="' + srcLink + '" />');
        $("<p>" + "Temperature: " + (response.main.temp * 9 / 5 - 459.67).toFixed(1) + " °F" + "</p>").appendTo(current);
        $("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>").appendTo(current);
        $("<p>" + "Wind Speed: " + response.wind.speed + " MPH" + "</p>").appendTo(current);
        
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var city = response.name;
        getUV(lat, lon);
        addtoHistory(city);
    });
    
    function getUV(lat, lon) {
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=cc1d7110e10d9b9390a02a70dc1628f5"
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(response) {
            $("<p id='uv'>" + "UV Index: " + response.value + "</p>").appendTo(current);
            if (response.value > 8) {
                $("#uv").css('color', 'rgb(206, 45, 45)');
            } 
            else if (response.value > 4) {
                $("#uv").css('color', 'rgb(245, 147, 0)');
            }
            else {
                $("#uv").css('color', 'rgb(0, 194, 19)');
            }
        })
    }
    
    function addtoHistory(city) {
        historyText.unshift(city)
        localStorage.setItem("storedPlaces", JSON.stringify(historyText));
        console.log(historyText)
        
        // create history link
        if (storedPlaces !== null) {
            var link = document.createElement("p");
            link.textContent = city;
            link.className = "history-link";
            toAdd.appendChild(link);
            $("#history").prepend(toAdd)
        }
        else {
            var link = document.createElement("p");
            link.textContent = city;
            link.className = "history-link";
            $("#history").prepend(link)
        }
    }
}

// GET FORECAST WEATHER
function forecastWeather(cityName) {
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=cc1d7110e10d9b9390a02a70dc1628f5"
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var srcLink1 = "http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png"
        var srcLink2 = "http://openweathermap.org/img/wn/" + response.list[1].weather[0].icon + "@2x.png"
        var srcLink3 = "http://openweathermap.org/img/wn/" + response.list[2].weather[0].icon + "@2x.png"
        var srcLink4 = "http://openweathermap.org/img/wn/" + response.list[3].weather[0].icon + "@2x.png"
        var srcLink5 = "http://openweathermap.org/img/wn/" + response.list[4].weather[0].icon + "@2x.png"
        
        console.log(response);

        $("<div class='forecastDivs' id='plusOne'>"+"</div>").appendTo(forecast);
        var plusOne = $("#plusOne")
        $("<h3>" + moment().add(1, 'days').format('l') + "</h3>").appendTo(plusOne);
        $("#plusOne").append('<img id="iconOne" src="' + srcLink1 + '" />')
        $("<p>" + "Temp: " + (response.list[0].main.temp * 9 / 5 - 459.67).toFixed(1) + " °F" + "</p>").appendTo(plusOne);
        $("<p>" + "Humidity: " + response.list[0].main.humidity + "%" + "</p>").appendTo(plusOne);

        $("<div class='forecastDivs' id='plusTwo'>"+"</div>").appendTo(forecast);
        var plusTwo = $("#plusTwo")
        $("<h3>" + moment().add(2, 'days').format('l') + "</h3>").appendTo(plusTwo);
        $("#plusTwo").append('<img id="iconTwo" src="' + srcLink2 + '" />')
        $("<p>" + "Temp: " + (response.list[1].main.temp * 9 / 5 - 459.67).toFixed(1) + " °F" + "</p>").appendTo(plusTwo);
        $("<p>" + "Humidity: " + response.list[1].main.humidity + "%" + "</p>").appendTo(plusTwo);

        $("<div class='forecastDivs' id='plusThree'>"+"</div>").appendTo(forecast);
        var plusThree = $("#plusThree")
        $("<h3>" + moment().add(3, 'days').format('l') + "</h3>").appendTo(plusThree);
        $("#plusThree").append('<img id="iconThree" src="' + srcLink3 + '" />')
        $("<p>" + "Temp: " + (response.list[2].main.temp * 9 / 5 - 459.67).toFixed(1) + " °F" + "</p>").appendTo(plusThree);
        $("<p>" + "Humidity: " + response.list[2].main.humidity + "%" + "</p>").appendTo(plusThree);

        $("<div class='forecastDivs' id='plusFour'>"+"</div>").appendTo(forecast);
        var plusFour = $("#plusFour")
        $("<h3>" + moment().add(4, 'days').format('l') + "</h3>").appendTo(plusFour);
        $("#plusFour").append('<img id="iconFour" src="' + srcLink4 + '" />')
        $("<p>" + "Temp: " + (response.list[3].main.temp * 9 / 5 - 459.67).toFixed(1) + " °F" + "</p>").appendTo(plusFour);
        $("<p>" + "Humidity: " + response.list[3].main.humidity + "%" + "</p>").appendTo(plusFour);

        $("<div class='forecastDivs' id='plusFive'>"+"</div>").appendTo(forecast);
        var plusFive = $("#plusFive")
        $("<h3>" + moment().add(5, 'days').format('l') + "</h3>").appendTo(plusFive);
        $("#plusFive").append('<img id="iconFive" src="' + srcLink5 + '" />')
        $("<p>" + "Temp: " + (response.list[4].main.temp * 9 / 5 - 459.67).toFixed(1) + " °F" + "</p>").appendTo(plusFive);
        $("<p>" + "Humidity: " + response.list[4].main.humidity + "%" + "</p>").appendTo(plusFive);
    });
}

// function kelvinToFahrenheit(kelvin) {
//     var fahrenheit = kelvin * (9/5) - 459.67;
//     return fahrenheit
// }