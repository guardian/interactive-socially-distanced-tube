import gsap from "gsap";

// Canvas consts
const canvas = document.querySelector("#normal");
const ctx = canvas.getContext("2d");
// const startBtn = document.querySelector("#start-btn")
const w = 400;
const h = 300;
canvas.width = w;
canvas.height = h
const numRect = 3;

class myRect {
    constructor(indx, yVal){
        this.x = 10,
        this.y = 10,
        this.width = 100,
        this.height = 100,
        this.fill = "#2196F3",
        this.fillOpacity = 0.5,
        this.animation = gsap.timeline()
            .to(this, 1, 
                { x: (100 * indx), y: yVal, delay: startDelay},
            )
            .to(this, 0.5,
                { x: (150 * indx) , y: (yVal / 2), fill: "#c2b280", delay: (2 - startDelay) }
            )
            .to(this, 0.5,
                {y: -100, delay: 0.3});
    }
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = this.fillOpacity;
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.restore(); // does this do anything?
    }
}

let allRects = [];
let yVal = 0;
let startDelay = 0;

for(let i=0; i < numRect; i++){
    allRects.push(new myRect(i, yVal, startDelay))
    yVal += 90;
    startDelay += 0.5;
}

function render() {
  ctx.clearRect(0, 0, w, h);
  allRects.forEach(rect => rect.draw(ctx))
}

// startBtn.addEventListener("click", render, false)
gsap.ticker.add(render);

