const weatherform= document.querySelector(".weatherform")
const cityInput= document.querySelector(".cityinput")
const card= document.querySelector(".card")
const enter= document.querySelector(".button")
const info= document.querySelector(".info")
const apikey="47218f1aa0cd885f577d206b20825e2a";
const one= document.getElementById("one")
const two= document.getElementById("two")
const other_info= document.querySelector(".other-info")
let hourHand= document.querySelector(".hourhand")
let minuteHand= document.querySelector(".minutehand")
let data;
let sunrisestamp;
let sunsetstamp;
let timezoneOffset=0;
let is_Day;

function updateTime(){
    const date= new Date();
    if(timezoneOffset===0){
        
        let hours= date.getHours();
        const minutes= date.getMinutes();
        const hourAngle = (hours % 12) * 30 + minutes / 2;
        const minuteAngle = minutes * 6;
        hourHand.style.transform= `rotate(${hourAngle}deg)`;
        minuteHand.style.transform=`rotate(${minuteAngle}deg)`;}
    else{
        const localhour= (date.getUTCHours()+timezoneOffset) % 24;
        const minutes = date.getMinutes();

        const hourAngle = (localhour % 12) * 30 + minutes / 2;
        const minuteAngle = minutes * 6;
        hourHand.style.transform= `rotate(${hourAngle}deg)`;
        minuteHand.style.transform=`rotate(${minuteAngle}deg)`;
        const sunriseDate = new Date(sunrisestamp * 1000);
        const sunsetDate = new Date(sunsetstamp * 1000);
        is_Day = localhour >= sunriseDate.getHours() && localhour < sunsetDate.getHours();
        setTimeout((()=>console.log("hello")), 2000)
        if(is_Day){
            card.classList.remove("normalb");
            card.classList.add("dayb")
            card.classList.remove("nightb");
            
            document.body.classList.remove("normal");
            document.body.classList.remove("night")
            document.body.classList.add("day")
    
            enter.classList.remove("normalb")
            enter.classList.remove("nightb")
            enter.classList.add("dayb")
            info.classList.remove("normalb")
            info.classList.remove("nightb")
            info.classList.add("dayb")
            two.classList.remove("normalb")
            two.classList.remove("nightb")
            two.classList.add("dayb")
        }
        else if(!is_Day){
            card.classList.remove("normalb");
            card.classList.remove("dayb");
            card.classList.add("nightb")
            document.body.classList.remove("normal");
            document.body.classList.remove("day")
            document.body.classList.add("night")
            enter.classList.remove("normalb")
            enter.classList.remove("dayb")
            enter.classList.add("nightb")
            info.classList.remove("normalb")
            info.classList.remove("dayb")
            info.classList.add("nightb")
            two.classList.remove("normalb")
            two.classList.remove("dayb")
            two.classList.add("nightb")
        }
        console.log(is_Day)

    }    
}
updateTime();
intervalId=setInterval(updateTime, 1000); 
console.log(intervalId)



two.addEventListener("mouseover", event=>{
    const pressurecontainer= document.createElement("div")
    pressurecontainer.classList.add("pressure-info");
    const pressure= document.createElement("p");
    pressure.textContent=`Pressure: ${data.main.pressure}`;
    pressurecontainer.appendChild(pressure);
    pressurecontainer.style.position="absolute";
    pressurecontainer.style.top = `${one.offsetTop + one.offsetHeight}px`;
    pressurecontainer.style.left = `${one.offsetLeft}px`;
    pressurecontainer.style.padding="5px";
    pressurecontainer.style.borderRadius="5px"
    pressurecontainer.style.display="block"
    two.addEventListener("mouseout", event=>{
        pressurecontainer.style.display="none"
    })
    card.appendChild(pressurecontainer)
})
weatherform.addEventListener("submit", async event=> {
    event.preventDefault();
    const city= cityInput.value
    if(city){
        try{
            const weatherdata= await getWeatherData(city);
            displayWeatherInfo(weatherdata)
        }
        catch(error){
            console.error(error)
            displayError(error)
        }
    }
    else{
        displayError("Please Enter The City")
    }
});
async function getWeatherData(city){
    const apiurl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`
    const response= await fetch(apiurl);
    if(!response.ok){
        throw new Error("Couldn't fetch weather Data")
    }
    data= await response.json()
    console.log(data)
    one.addEventListener("mouseover", event=>{
        const windcontainer= document.createElement("div")
        windcontainer.classList.add("wind-info");
    
        const windspeed= document.createElement("p");
        windspeed.textContent=`Wind Speed: ${data.wind.speed}`;
        windcontainer.appendChild(windspeed);
    
        const winddeg= document.createElement("p");
        winddeg.textContent=`Wind Degree: ${data.wind.deg}`
        windcontainer.appendChild(winddeg);
        windcontainer.style.position="absolute";
        windcontainer.style.top = `${one.offsetTop + one.offsetHeight}px`;
        windcontainer.style.left = `${one.offsetLeft}px`;
        windcontainer.style.background= "transparent"
        windcontainer.style.padding="5px";
        windcontainer.style.borderRadius="5px"
        windcontainer.style.display="block"
        one.addEventListener("mouseout", event=>{
           windcontainer.style.display="none"
        })
        card.appendChild(windcontainer)
    })
    return data
}
function displayWeatherInfo(data){
    console.log("weew")
    console.log(data)
    console.log(data.main.temp)
    card.textContent=""
    let name_of_city= document.createElement("h1")
    name_of_city.classList.add("Citydisplay")
    name_of_city.textContent=data.name
    card.style.display="flex"
    card.appendChild(name_of_city)
    let temp= document.createElement("p")
    temp.classList.add("tempDisplay");
    temp.textContent=`${(data.main.temp - 273).toFixed(2)}°C`
    card.appendChild(temp)
    let humidity= document.createElement("p");
    humidity.classList.add("humidityDisplay")
    humidity.textContent=`Humidity: ${data.main.humidity} %`
    card.appendChild(humidity)
    let description= document.createElement("p")
    description.classList.add("descriptionDisplay")
    description.textContent= `${data.weather[0].description}`
    card.appendChild(description)
    let weatherEmoji= document.createElement("p")
    weatherEmoji.textContent=getWeatherEmoji(data.weather[0].id)
    weatherEmoji.classList.add("weatheremoji")
    card.appendChild(weatherEmoji)
    timezoneOffset= (data.timezone)/3600
    sunrisestamp= data.sys.sunrise
    sunsetstamp=data.sys.sunset
    if(is_Day){
        card.classList.remove("normalb");
        card.classList.remove("nightb");
        card.classList.add("dayb")
        document.body.classList.remove("normal");
        document.body.classList.remove("night")
        document.body.classList.add("day")

        enter.classList.remove("normalb")
        enter.classList.remove("nightb")
        enter.classList.add("dayb")
        info.classList.remove("normalb")
        info.classList.remove("nightb")
        info.classList.add("dayb")
        two.classList.remove("normalb")
        two.classList.remove("nightb")
        two.classList.add("dayb")
    }
    else if(!is_Day){
        card.classList.remove("normalb");
        card.classList.remove("dayb");
        card.classList.add("nightb")
        document.body.classList.remove("normal");
        document.body.classList.remove("day")
        document.body.classList.add("night")
        enter.classList.remove("normalb")
        enter.classList.remove("dayb")
        enter.classList.add("nightb")
        info.classList.remove("normalb")
        info.classList.remove("dayb")
        info.classList.add("nightb")
        two.classList.remove("normalb")
        two.classList.remove("dayb")
        two.classList.add("nightb")
    }
    console.log(is_Day)
}
function getWeatherEmoji(weatherId){
    if(weatherId>= 200 && weatherId< 300){
        return "⚡"
    }
    else if(weatherId>= 300 && weatherId<500){
        return "☔"
    }
    else if(weatherId>= 500 && weatherId<600){
        
        return "⛈"
    }
    else if(weatherId>= 600 && weatherId< 700){
        return "❄☃"
    }
    else if(weatherId>= 700 && weatherId< 800){
        return "🌪"
    }
    else if(weatherId=== 800){
        return "🌞"
    }
    else if(weatherId>800){
        return "☁"
    }
    else{
        return "Couldn't fetch the ID"
    }
}
function displayError(message){
    card.textContent=""
    let error= document.createElement("p");
    error.classList.add("errordisplay");
    error.textContent=message;
    card.appendChild(error)
    card.style.display="flex"

}