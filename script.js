var searchFormEl = document.querySelector('#search-city');
var resultTextEl = document.querySelector('#currentCityName');
var currentCityName = '';
var APIkey = '602aeb9d87dcb3f34675e61063025e32';
var weather = [];
var cityList = [];

function displayWeather(weather) {
    $("#day0-wind").text(weather[0].wind);
    $("#day0-UV").text(weather[0].UV);
    $('#currentCityName').text(currentCityName);
    if (weather[0].UV > 9) { varUV = 'Red' };
    if (weather[0].UV < 9 && 3) { varUV = 'Yellow' };
    if (weather[0].UV < 3) { varUV = 'Green' };
    $('#day0-UV').css("background-color", varUV);
    for (var i = 0; i <= 6; i++) {
        $('#day' + i + '-temp').text(weather[i].temp);
        $('#day' + i + '-icon').html(weather[i].icon);
        $('#day' + i + '-hum').text(weather[i].hum);
        $('#day' + i + '-date').html(weather[i].date);
        $('#day' + i + '-wind').text(weather[i].wind);
        $('#day' + i + '-icon').attr("src", weather[i].icon);
    }
}

function showCityList(cityList) {
    var varText = "";
    for (var i = 0; i < cityList.length; i++) {
        varText += `<li class="btn list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick="searchApi('` + cityList[i] + `')">` + cityList[i] + '</li>';
    }
    $('#cityListGroup').html(varText);
}

function updateCityList(currentCityName) {
    cityList.indexOf(currentCityName) === -1 ? cityList.push(currentCityName) :
        localStorage.setItem("cityList", JSON.stringify(cityList));
    showCityList(cityList);
}

function searchApi2(varLat, varLon, currentCityName) {
    var locQueryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=` + varLat + `&lon=` + varLon + `&exclude=hourly&units=imperial&appid=` + APIkey;
    fetch(locQueryUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (locRes) {
            weather = [];
            updateCityList(currentCityName);
            for (var i = 0; i < 6; i++) {
                var wDay = {
                    "date": locRes.daily[i].dt,
                    "temp": locRes.daily[i].temp.day + ' °F',
                    "hum": locRes.daily[i].humidity + '%',
                    "wind": locRes.daily[i].wind_speed + ' MPH',
                    "UV": locRes.daily[i].uvi,
                    "icon": 'https://openweathermap.org/img/wn/' + locRes.daily[i].weather[0].icon + '.png'
                }
                wDay.date=wDay.date * 1000;
                var dateObject = new Date(wDay.date);
                wDay.date = dateObject.toLocaleDateString();
                weather.push(wDay);
            }
            displayWeather(weather);
        })
        .catch(function (error) {

        });
}

function searchApi(query) {
    var locQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=` + query + `&appid=` + APIkey;

    fetch(locQueryUrl)
        .then(function (response) {
            if (!response.ok) {
                $("#search-input")[0].reset()
                alert("ERROR: City not found");
                throw response.json();
            }
            return response.json();
        })
        .then(function (locRes) {
            varLat = locRes.city.coord.lat;
            varLon = locRes.city.coord.lon;
            currentCityName = query;
            searchApi2(varLat, varLon, currentCityName);
        })
        .catch(function (error) {
            alert('That is not a city, try again');
        });
}

function handleSearchFormSubmit(event) {
    event.preventDefault();
    var searchInputVal = document.querySelector('#search-input').value;
    if (!searchInputVal) {
        alert('Try again');
        return;
    }
    searchApi(searchInputVal);
}

function loadCityList(cityList) {
    cityList = JSON.parse(localStorage.getItem("cityList"));
    if (!cityList) {

        cityList = [];
        return cityList;
    }
    return cityList;
}
searchFormEl.addEventListener('submit', handleSearchFormSubmit);

cityList = loadCityList(cityList);
searchApi("Saint Paul");