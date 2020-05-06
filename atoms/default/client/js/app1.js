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
    let colIndex = Math.floor(i / numParticlesInCol)
    let colNum =  numColsInStation - colIndex;  // round down to get column number

    let y = indexInCol * particleSpacing + particleOffset;
    let x = colNum * particleSpacing + particleOffset;
    return {x, y}; 
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.animation = new gsap.timeline({
            repeat: -1,
            yoyo: true
          })
          .to(this, 3, {
            x: 100,
            y: 300 })
    }
    draw (ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, particleRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = particleColor;
        ctx.fill()
        ctx.save();
    }
}

const moveIt = (obj, x, y) => {
    console.log("OBJ", obj, "obj.x", obj.x, "new X", x, "new y", y);
    gsap.to(obj, {x: x, y: y, duration: 0.5, ease: "elastic"})
}


const render = () => {
    // let arrParticles = new Array(numParticles).fill("particle"); //generate array of required length
    let arrParticles = [];
    
    // create particles 
    for (let i = 0; i < numParticles; i++) {
        arrParticles.push(new Particle(particleOffset, particleOffset));
    }

    // draw particles in starting position
    arrParticles.forEach((particle) => {
        console.log("draw function called");
        particle.draw(ctx);
    })

    // arrParticles.forEach((particle, i) => {
    //     let {x, y} = calcCircleStationPos(i);
    //     console.log("mover function called");
    //     moveIt(particle, x, y)
    // })

}

startBtn.addEventListener("click", () => render(), false)




// -------------------------------

// const makeParticle = (startX, startY) => {
//     //draw a circle in canvas
//     ctx.beginPath();
//     ctx.arc(startX, startY, particleRadius, 0, 2 * Math.PI, false);
//     ctx.fillStyle = particleColor;
//     ctx.fill();
// }
