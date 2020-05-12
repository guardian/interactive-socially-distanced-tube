import gsap from "gsap";
import {numParticles, numberOfTrains, canvas, ctx, clock, runButton, canvasConfig, particleConfig, particleSpacing, numParticlesInRow,
    animationConfig, timeToStationMs, trainInterval, trainH} from "./constants.js"
import {dotsPerTrain} from "./distanced-config.js"
import {setUpAnimation, setUpTrainAnimation} from "./animation.js"
import {roundedRect, drawDoors, drawTrain} from "./background.js"

const {w, h, doorWidth, doorPadding, carriageLength, carriagePadding, numCarriages, trackHeight} = canvasConfig;
const {particleRadius, particleOffset, particleColor} = particleConfig;
const {timeToStation, waitForTrain, trainTimeToArrive} = animationConfig; 

// set up canvas
canvas.width = w;
canvas.height = h;
// weird hack for rounded rectangles 
CanvasRenderingContext2D.prototype.roundedRect = roundedRect;


// Timer consts 
const totalTime = numberOfTrains * trainInterval; // NB not including time to station
const timePerMin = (totalTime / 60) * 1000; // time in milliseconds for each tick of the clock

// Timer & train variables modified by code below 
let isRunning = false;
let clockHour;
let clockMin;
let clockIntrvl;
let clockDelay;
let currentTrain = 1;

let arrParticles = [];
let arrTrains = [];
let startDelay = 0; 
// everyone should get there before train leaves, eg everyone gets there in 3 secs.
let startDelayInterval = (timeToStation - waitForTrain) / numParticles;


const setUpStation = (ctx) => {
    //draw train tracks
    ctx.fillStyle = "#F6F6F6";
    ctx.fillRect(0, (trainH /2 - trackHeight/2) , w, trackHeight);

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

const calcDotStationPos = (i) => {
    let indexInRow = numParticlesInRow - (i % numParticlesInRow);
    let rowNum = Math.floor(i / numParticlesInRow)

    let y = trainH + (rowNum * particleSpacing) + particleSpacing;
    let x = indexInRow * particleSpacing + doorWidth + (doorPadding *2);
    return {x, y}; 
}

const calcDotTrain = (indx) => Math.ceil((indx + 1) / dotsPerTrain); // add one to avoid zero-index

class Train {
    constructor (indx) {
        this.x = -numCarriages * carriageLength + -numCarriages * carriagePadding;
        this.midX = particleOffset;
        this.startDelay = timeToStation - trainTimeToArrive;
        this.trainNumber = indx + 1; // bumping up so not zero-based
        this.animation = setUpTrainAnimation(this);
    }
    draw (ctx) {
        drawTrain(ctx, this.x, this.y);
    }
}


class Particle {
    constructor(startX, startY, startDelay, train, index) {
        this.x = startX;
        this.y = startY;
        this.train = train;
        this.index = index;
        this.startDelay = startDelay;
        this.fill = particleColor;
        this.gettingOn = train <= numberOfTrains;
        this.travelTime = Math.random() * (timeToStation - waitForTrain);
        this.opacity = 1;
        this.animation = setUpAnimation(this)
    }
    draw (ctx){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.fill;
        ctx.fillOpacity = this.opacity;
        ctx.arc(this.x, this.y, particleRadius, 0, 2 * Math.PI, false);
        ctx.fill()
    }
}


// create particles 
const createParticles = () => {
    arrParticles = [];
    for (let i = 0; i < numParticles; i++) {
        let {x, y} = calcDotStationPos(i);
        let train = calcDotTrain(i);
        arrParticles.push(new Particle(x, y, startDelay, train, i));
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
    drawAllDots(ctx);
    playAllDots();
    drawAllTrains(ctx);
}

const drawAllDots = (ctx) => arrParticles.forEach((particle) => particle.draw(ctx)) 
const playAllDots = () => arrParticles.forEach((particle) => particle.animation.play()) // dots are paused by default

const pauseAllDots = () => arrParticles.forEach((particle) => particle.animation.pause()) 

const drawAllTrains = (ctx) => arrTrains.forEach((train) => train.draw(ctx)); // trains run by default


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

    isRunning = true;

    //start clock and start gsap ticker
    const startClock = () => clockIntrvl = setInterval(tickClock, timePerMin);
    clockDelay = window.setTimeout(startClock, timeToStationMs);
    playAllDots();
    gsap.ticker.add(render);
}

runButton.addEventListener("click", run, false);

// TRACK SCROLL AND TRIGGER ANIMATION WHEN FULLY VISIBLE
const checkScroll = () => {
    try {
        if(window.frameElement.getBoundingClientRect().top < window.parent.innerHeight * 0.9 && !isRunning) {
            run()
        } else {
            window.requestAnimationFrame(checkScroll)
        }

    } catch(err) {
        if(!isRunning) {run()};
    }
}

window.onload = ()=> {
    try{
        window.resize();
    } catch {
        console.log("not in a iframe");
    }
    setUpStation(ctx);
    createParticles();
    drawAllDots(ctx); 
    checkScroll()
    
};

