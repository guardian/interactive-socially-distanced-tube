import gsap from "gsap";
import {numParticles, numberOfTrains, canvas, ctx, clock, toggle, toggleLabel, runButton, canvasConfig, trainW, particleConfig, particleSpacing, numParticlesInCol, numColsInStation,
    animationConfig, timeToStationMs} from "./constants.js"
import {setUpAnimation} from "./animation.js"

const {w, h, stationW, yellowLineOffset, yellowLineWidth, doorPosition1, doorPosition2} = canvasConfig;
const {particleRadius, particleOffset, particleColor} = particleConfig;
const {timeToStation, waitForTrain, trainInterval, timeToLeave, timeToBoard} = animationConfig; 

// CHANGE THIS VARIABLE 
let dotsPerTrain = 42;


// Timer consts 
const totalTime = numberOfTrains * trainInterval + timeToLeave + timeToBoard; // NB not including time to station
const timePerMin = (totalTime / 60) * 1000; // time in milliseconds for each tick of the clock

// Timer & train variables modified by code below 
let clockHour;
let clockMin;
let clockIntrvl;
let clockDelay;
let currentTrain = 1;

let arrParticles = [];
let startDelay = 0; 
// everyone should get there 2 seconds before train leaves, eg everyone gets there in 3 secs.
let startDelayInterval = (timeToStation - waitForTrain) / numParticles;

// set up canvas
canvas.width = w;
canvas.height = h;

const setUpStation = (ctx) => {
    //draw train area
    ctx.fillStyle = "#FF7F7F";
    ctx.strokeRect((stationW + yellowLineOffset), 0, (trainW - 15), h);
    // draw yellow line
    ctx.fillStyle = "#e5e500";
    ctx.fillRect(stationW, 0, yellowLineWidth, h);

    //draw doors
    ctx.fillStyle = "#EDEDED";
    ctx.fillRect(0, (h * doorPosition2) - 25, 20, 50);  //extract these variables 
    ctx.fillStyle = "#000";
    ctx.strokeRect(0, (h * doorPosition2) - 25, 20, 50);
    

    ctx.fillStyle = "#EDEDED";
    ctx.fillRect(0, (h * doorPosition1) - 25, 20, 50)
    ctx.fillStyle = "#000";
    ctx.strokeRect(0, (h * doorPosition1) - 25, 20, 50)
}

const tickClock = () => {
    clock.textContent = `${clockHour}:${clockMin < 10 ? '0' + clockMin : clockMin}`;
    if(clockMin === 59) {
        clockMin = 0; 
        clockHour = 9;
        tickClock()
    }
    if(clockHour === 9 & clockMin === 1){
        clearUp();
    }
    clockMin++;
}

// start it out from one door or another 
const calcDotStartY = (i) => {
    return i % 2 === 0 ? h * 0.2 : h * 0.8; 
}

const calcDotStationPos = (i) => {
    // y needs to go from the start of the column, we want it reversed so dots build up from the bottom 
    let indexInCol = numParticlesInCol - (i % numParticlesInCol);
    // start at the side closest to the train
    let colIndex = Math.floor(i / numParticlesInCol)
    let colNum =  numColsInStation - colIndex;  // round down to get column number

    let y = indexInCol * particleSpacing + particleOffset;
    let x = colNum * particleSpacing + particleOffset;
    return {x, y}; 
}

const calcDotTrain = (indx) => Math.ceil((indx + 1) / dotsPerTrain); // add one to avoid zero-index

class Particle {
    constructor(startX, startY, midX, midY, startDelay, train, index) {
        this.x = startX;
        this.y = startY;
        this.midX = midX;
        this.midY = midY;
        this.train = train;
        this.index = index;
        this.startDelay = startDelay;
        this.fill = particleColor;
        this.gettingOn = train <= numberOfTrains;
        this.travelTime = Math.random() * (timeToStation - waitForTrain);
        this.animation = setUpAnimation(this)
    }
    draw (ctx){
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, particleRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.fill;
        ctx.fill()
    }
}


// create particles 
const createParticles = () => {
    arrParticles = [];
    for (let i = 0; i < numParticles; i++) {
        let startY = calcDotStartY(i);
        let {x, y} = calcDotStationPos(i);
        let train = calcDotTrain(i);
        arrParticles.push(new Particle(particleOffset, startY, x, y, startDelay, train, i));
        startDelay += startDelayInterval;
        train > currentTrain && currentTrain++; // bump currentTrain if previous ran out of space
    }
}

const toggleDistancing = (e) => { 
    dotsPerTrain = e.target.checked ? 7 : 42;
    toggleLabel.textContent = (e.target.checked ? "with social distancing" : "normally");
}

const render = () => {
    ctx.clearRect(0, 0, w, h);
    setUpStation(ctx);
    arrParticles.forEach((particle) => {
        particle.draw(ctx);
    })
}

const pauseAll = () => {
    arrParticles.forEach((particle) => {
        particle.animation.pause();
    }) 
}

const clearUp = () => {
    clearInterval(clockIntrvl);
    clearTimeout(clockDelay);
}

const run = () => {
    gsap.ticker.remove(render);
    clearUp();

    // reset modified variables
    clockHour = 8;
    clockMin = 0;
    tickClock();
    startDelay = 0;
    createParticles();

    //start clock and start gsap ticker
    const startClock = () => clockIntrvl = setInterval(tickClock, timePerMin);
    clockDelay = window.setTimeout(startClock, timeToStationMs);
    gsap.ticker.add(render);
}

toggle.addEventListener("input", toggleDistancing, false);
runButton.addEventListener("click", run, false);

window.onload = ()=> {
    try{
        window.resize();
    } catch {
        console.log("not in a iframe");
    }
    // run()
};