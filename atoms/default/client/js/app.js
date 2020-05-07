import gsap from "gsap";

// Canvas consts
const canvas = document.querySelector("#normal");
const ctx = canvas.getContext("2d");
const clock = document.querySelector("#clock");
const w = 500;
const h = 400;
const stationW = 450;
const trainW = w - stationW;
const yellowLineOffset = 12;
const yellowLineWidth = 10;
const trainOffset = 10;
const trainEdge = w - (trainW - yellowLineOffset) + trainOffset; // x position of the edge of train plus 10 padding;
const spaceInTrain = trainW - (trainOffset * 2) - yellowLineOffset - yellowLineWidth;

// CHANGE THESE VARIABLES //
const numParticles = 1005;
const dotsPerTrain = 42;
const numberOfTrains = 24; //? 24

// Particle consts
const particleRadius = 5;
const particleOffset = 10; //offset from top;
const particleColor = "navy";
const angryParticleColor = "red";

const particleSpacing = particleRadius * 2 + 0.5 * particleRadius;
const numParticlesInCol = Math.floor((h - particleOffset * 2) / particleSpacing);
const numColsInStation = Math.floor((stationW - particleOffset * 2) / particleSpacing);

// Animation consts 
const timeToStation = 5;
const timeToStationMs = timeToStation * 1000
const waitForTrain = 2;
const trainInterval = 1.3; 
const timeToLeave = 0.9;
let currentTrain = 1;  //modified below

// Timer consts 
const totalTime = numberOfTrains * trainInterval + timeToLeave; // NB not including time to station
const timePerMin = (totalTime / 60) * 1000; // time in milliseconds for each tick of the clock 
let clockIntrvl;
let clockDelay;
let clockHour = 8;
let clockMin = 0;

// set up canvas
canvas.width = w;
canvas.height = h;

const setUpStation = (ctx) => {
    //draw train area
    ctx.fillStyle = "#FF7F7F";
    ctx.fillRect((stationW + yellowLineOffset), 0, (trainW - 15), h);
    
    // draw yellow line
    ctx.fillStyle = "#e5e500";
    ctx.fillRect(stationW, 0, yellowLineWidth, h);
}

const tickClock = () => {
    clock.textContent = `${clockHour}:${clockMin < 10 ? '0' + clockMin : clockMin}`;
    if(clockMin === 59) {
        clockMin = 0; 
        clockHour = 9;
        tickClock()
    }
    if(clockHour === 9 & clockMin === 2){
       clearInterval(clockIntrvl);
       clearTimeout(clockDelay);
       pauseAll();
    }
    clockMin++;
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

const calcBoardTrainDelay = (train, startDelay, travelTime) => {
    const baseDelay = timeToStation - startDelay - travelTime;
    return baseDelay + (train * trainInterval); 
}

const calcTrainPos = () => trainEdge + Math.random() * spaceInTrain;

const setUpAnimation = (particle) => {

    // let toTrainTween = gsap.to(particle, 0.5, {
    //     x: calcTrainPos(),
    //     delay: calcBoardTrainDelay(particle.train, startDelay, particle.travelTime), //max out at total time.
    //     ease: "power1.inOut"
    //   })
    // let trainTween = gsap.to(particle, 1, {
    //     y: particle.gettingOn ? (h - particle.midY) * -1 : particle.midY + 3, // move them out at a steady pace ,each covers the same distance
    //     delay: 0.5,
    //     ease: particle.gettingOn ? "power2.in" : "steps",
    //   })


    let tl = gsap.timeline()
          .to(particle, particle.travelTime, {
            x: particle.midX,
            y: particle.midY,
            delay: startDelay,
            ease: "rough"
          }) 
          .to(particle, 0.5, {
            x: calcTrainPos(),
            delay: calcBoardTrainDelay(particle.train, startDelay, particle.travelTime), //max out at total time.
            ease: "power1.inOut"
          })
          .to(particle, timeToLeave, {
            y: particle.gettingOn ? (h - particle.midY) * -1 : particle.midY + 3, // move them out at a steady pace ,each covers the same distance
            delay: 0.3,
            ease: particle.gettingOn ? "power2.in" : "steps",
          })
    
    // if(particle.gettingOn){
    //     tl.add(toTrainTween).add(trainTween);
    // }
    return tl;
}


class Particle {
    constructor(startX, startY, midX, midY, startDelay, train, index) {
        this.x = startX;
        this.y = startY;
        this.midX = midX;
        this.midY = midY;
        this.train = train;
        this.index = index;
        this.gettingOn = train <= numberOfTrains;
        this.travelTime = Math.random() * (timeToStation - waitForTrain);
        this.animation = setUpAnimation(this)
    }
    draw (ctx){
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, particleRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = particleColor;
        ctx.fill()
    }
}

let arrParticles = [];
let startDelay = 0; 
// everyone should get there 2 seconds before train leaves, eg everyone gets there in 3 secs.
let startDelayInterval = (timeToStation - waitForTrain) / numParticles;


// create particles 
for (let i = 0; i < numParticles; i++) {
    let {x, y} = calcDotStationPos(i);
    let train = calcDotTrain(i);
    arrParticles.push(new Particle(particleOffset, particleOffset, x, y, startDelay, train, i));
    startDelay += startDelayInterval;
    train > currentTrain && currentTrain++; // bump currentTrain if previous ran out of space
}

const pauseAll = () => {
    arrParticles.forEach((particle) => {
        particle.animation.kill();
    }) 
}

const render = () => {
    ctx.clearRect(0, 0, w, h);
    setUpStation(ctx);

    arrParticles.forEach((particle) => {
        particle.draw(ctx);
    })
}



//wait till everyone is at the station, then start ticker;
const startClock = () => clockIntrvl = setInterval(tickClock, timePerMin);
clockDelay = window.setTimeout(startClock, timeToStationMs);

gsap.ticker.add(render);

try{
    window.resize();
} catch{
    console.log("not in a iframe");
}
