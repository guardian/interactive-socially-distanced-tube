// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
import gsap from "gsap";

// Canvas consts
const canvas = document.querySelector("#normal");
const ctx = canvas.getContext("2d");
const startBtn = document.querySelector("#start-btn")
const w = 400;
const h = 300;
const stationW = 300;
const trainW = w - stationW;
const trainX = w - (trainW / 2); // x position of the middle of the "train";

// Particle consts
const numParticles = 10;
const particleRadius = 7;
const particleOffset = 10; //offset from top;
const particleColor = "navy";

const particleSpacing = particleRadius * 2 + 0.5 * particleRadius;
const numParticlesInCol = Math.floor((h - particleOffset * 2) / particleSpacing);
const numColsInStation = Math.floor((stationW - particleOffset * 2) / particleSpacing);

// set up canvas
canvas.width = w;
canvas.height = h;

// set up train area
ctx.fillStyle = "#afeeee";
ctx.fillRect(stationW, 0, trainW, h);

const calcCircleStationPos = (i) => {
    // y needs to go from the start of the column 
    // we want it reversed so dots build up from the bottom 
    let indexInCol = numParticlesInCol - (i % numParticlesInCol);
    // start at the side closest to the train
    let colNum = i < numParticlesInCol ? w - particleOffset : numColsInStation - Math.floor(i / numParticlesInCol);  // round down to get column number

    let y = indexInCol * particleSpacing + particleOffset;
    let x = colNum * particleSpacing + particleOffset;
    return {x, y}; 
}

class Particle {
    constructor(x, y, indx) {
        // start in the top left 
        this.x = x;
        this.y = y;

        // // middle position is "in station"
        // this.midX = midX;
        // this.midY = midY;

        // // end position "in train"
        // this.endX = trainX;
        // this.endY = midY;

        this.enterTween = gsap.to(this, {x: 30, y: 30, duration: 0.5, ease: "elastic"})
    }
    draw (ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, particleRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = particleColor;
        ctx.fill()
    }
}

// const makeParticle = (startX, startY) => {
//     //draw a circle in canvas
//     ctx.beginPath();
//     ctx.arc(startX, startY, particleRadius, 0, 2 * Math.PI, false);
//     ctx.fillStyle = particleColor;
//     ctx.fill();
// }

const render = () => {
    // let arrParticles = new Array(numParticles).fill("particle"); //generate array of required length
    let arrParticles = [];
    for (let i = 0; i < numParticles; i++) {
        let {x, y} = calcCircleStationPos(i);
        arrParticles.push(new Particle(x, y));
    }


    arrParticles.forEach((particle, i) => {
        particle.draw(ctx);
        console.log("tween drawn");
        particle.enterTween.play();
    })
    ctx.save()
}

// GET IT RUNNING 

startBtn.addEventListener("click", () => render(), false)