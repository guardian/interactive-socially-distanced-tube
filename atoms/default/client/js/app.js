import gsap from "gsap";
import {numParticles, numberOfTrains, canvas, ctx, clock, runButton, canvasConfig, particleConfig, particleSpacing, numParticlesInRow,
    animationConfig, timeToStationMs, trainInterval, trainH} from "./constants.js"
import {dotsPerTrain} from "./distanced-config.js"
import {setUpAnimation, setUpTrainAnimation} from "./animation.js"
import {roundedRect, drawDoors, drawTrain} from "./background.js"

const {w, h, stationH, doorPosition, doorWidth, doorHeight, doorPadding, carriageLength, carriagePadding, numCarriages, trackHeight} = canvasConfig;
const {particleRadius, particleOffset, particleColor} = particleConfig;
const {timeToStation, waitForTrain, trainTimeToArrive} = animationConfig; 

// set up canvas
canvas.width = w;
canvas.height = h;
// weird hack for rounded rectangles 
CanvasRenderingContext2D.prototype.roundedRect = roundedRect;


// CHANGE THIS VARIABLE 
// let dotsPerTrain = 42;

// Timer consts 
const totalTime = numberOfTrains * trainInterval; // NB not including time to station
const timePerMin = (totalTime / 60) * 1000; // time in milliseconds for each tick of the clock

// Timer & train variables modified by code below 
let clockHour;
let clockMin;
let clockIntrvl;
let clockDelay;
let currentTrain = 1;

let arrParticles = [];
let arrTrains = [];
let startDelay = 0; 
// everyone should get there 2 seconds before train leaves, eg everyone gets there in 3 secs.
let startDelayInterval = (timeToStation - waitForTrain) / numParticles;


const setUpStation = (ctx) => {
    //draw train tracks
    ctx.fillStyle = "#F6F6F6";
    ctx.fillRect(0, h - (trainH /2 + trackHeight/2) , w, trackHeight);

    drawDoors(ctx);
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
const calcDotStartX = (i) => {
    return i % 2 === 0 ? 0 + doorWidth : w - doorWidth; 
}

const calcDotStationPos = (i) => {
    // y needs to go from the start of the column, we want it reversed so dots build up from the bottom 
    let indexInRow = numParticlesInRow - (i % numParticlesInRow);
    let rowNum = Math.floor(i / numParticlesInRow)

    let y = stationH - (rowNum * particleSpacing) - particleSpacing;
    let x = indexInRow * particleSpacing + doorWidth + (doorPadding *2);
    return {x, y}; 
}

const calcDotTrain = (indx) => Math.ceil((indx + 1) / dotsPerTrain); // add one to avoid zero-index

class Train {
    constructor (indx) {
        this.x = -numCarriages * carriageLength + -numCarriages * carriagePadding;
        this.y = stationH;
        this.midX = particleOffset;
        this.startDelay = timeToStation - trainTimeToArrive;  //  why is this not this?-> timeToStation - trainTimeToArrive;
        this.trainNumber = indx + 1; // bumping up so not zero-based
        this.animation = setUpTrainAnimation(this);
    }
    draw (ctx) {
        drawTrain(ctx, this.x, this.y);
    }
}


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
        ctx.fillStyle = this.fill;
        ctx.arc(this.x, this.y, particleRadius, 0, 2 * Math.PI, false);
        ctx.fill()
    }
}


// create particles 
const createParticles = () => {
    arrParticles = [];
    for (let i = 0; i < numParticles; i++) {
        let startX = calcDotStartX(i);
        let startY = h * doorPosition + (doorHeight / 2);
        let {x, y} = calcDotStationPos(i);
        let train = calcDotTrain(i);
        arrParticles.push(new Particle(startX, startY, x, y, startDelay, train, i));
        startDelay += startDelayInterval;
        train > currentTrain && currentTrain++; // bump currentTrain if previous ran out of space
    }
}

// create trains 
const createTrains = () => {
    arrTrains = [];
    for(let i=0; i < numberOfTrains; i++){
        arrTrains.push(new Train(i));
    }
}

const render = () => {
    ctx.clearRect(0, 0, w, h);
    setUpStation(ctx);
    arrParticles.forEach((particle) => {
        particle.draw(ctx);
    })
    arrTrains.forEach((train) =>  {
        train.draw(ctx);
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
    createTrains();

    //start clock and start gsap ticker
    const startClock = () => clockIntrvl = setInterval(tickClock, timePerMin);
    clockDelay = window.setTimeout(startClock, timeToStationMs);
    gsap.ticker.add(render);
}

// const toggleDistancing = (e) => { 
//     dotsPerTrain = e.target.checked ? 7 : 42;
//     toggleLabel.textContent = (e.target.checked ? "with social distancing" : "normally");
// }

// toggle.addEventListener("input", toggleDistancing, false);
runButton.addEventListener("click", run, false);

window.onload = ()=> {
    try{
        window.resize();
        
    } catch {
        console.log("not in a iframe");
    }
    setUpStation(ctx);
    // run()
};