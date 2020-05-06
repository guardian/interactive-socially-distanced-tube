import gsap from "gsap";

// Canvas consts
const canvas = document.querySelector("#normal");
const ctx = canvas.getContext("2d");
const w = 400;
const h = 300;
const stationW = 300;
const trainW = w - stationW;
const yellowLineW = 15;
const trainX = w - ((trainW - yellowLineW) / 2); // x position of the middle of the "train";

// Particle consts
const numParticles = 10;
const particleRadius = 7;
const particleOffset = 10; //offset from top;
const particleColor = "navy";

const particleSpacing = particleRadius * 2 + 0.5 * particleRadius;
const numParticlesInCol = Math.floor((h - particleOffset * 2) / particleSpacing);
const numColsInStation = Math.floor((stationW - particleOffset * 2) / particleSpacing);

// Animation consts 
const timeToStation = 5;
const waitForTrain = 2;
const trainsArriving = 6;  // 6 in a 15 min period
const dotsPerTrain = 3;

//assign each dot a train number depending on number of trains arriving and dots per train
// for each dot - index 1 goes to train 1 unless over dotsperttrain, what bracket does index fall into.

// set up canvas
canvas.width = w;
canvas.height = h;

// set up train area
const setUpStation = (ctx) => {
    ctx.fillStyle = "#FF7F7F";
    ctx.fillRect((stationW + 15), 0, (trainW - 15), h);
    
    ctx.fillStyle = "#e5e500";
    ctx.fillRect(stationW, 0, 10, h);
}


const calcDotStationPos = (i) => {
    // y needs to go from the start of the column 
    // we want it reversed so dots build up from the bottom 
    let indexInCol = numParticlesInCol - (i % numParticlesInCol);
    // start at the side closest to the train
    let colIndex = Math.floor(i / numParticlesInCol)
    let colNum =  numColsInStation - colIndex;  // round down to get column number

    let y = indexInCol * particleSpacing + particleOffset;
    let x = colNum * particleSpacing + particleOffset;
    return {x, y}; 
}

const calcDotTrain = (indx) => {
    let selectedTrain = indx < dotsPerTrain ? 1 : Math.round(indx / dotsPerTrain);
    return selectedTrain;
}

class Particle {
    constructor(startX, startY, midX, midY, startDelay, train) {
        this.x = startX;
        this.y = startY;
        this.midX = midX;
        this.midY = midY;
        this.train = train;
        this.travelTime = Math.random(timeToStation - waitForTrain); // should be 3
        this.animation = gsap.timeline()
          .to(this, this.travelTime, {
            x: this.midX,
            y: this.midY,
            delay: startDelay
        })
          .to(this, 0.5, {
            x: trainX,
            delay: timeToStation - startDelay - this.travelTime
          })
          .to(this, 1, {
            y: (h - this.midY) * -1,
            delay: 0.5
          })
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
    arrParticles.push(new Particle(particleOffset, particleOffset, x, y, startDelay, train));
    startDelay += startDelayInterval;
}

console.log(arrParticles);

const render = () => {
    ctx.clearRect(0, 0, w, h);
    setUpStation(ctx);
    arrParticles.forEach((particle) => {
        particle.draw(ctx);
    })
}

gsap.ticker.add(render);