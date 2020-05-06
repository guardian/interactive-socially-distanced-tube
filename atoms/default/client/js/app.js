import gsap from "gsap";

// Canvas consts
const canvas = document.querySelector("#normal");
const ctx = canvas.getContext("2d");
const startBtn = document.querySelector("#start-btn")
const w = 400;
const h = 300;
canvas.width = w;
canvas.height = h
const numRect = 3;

class myRect {
    constructor(indx, yVal){
        this.x = 10,
        this.y = yVal,
        this.width = 200,
        this.height = 150,
        this.fill = "#2196F3",
        this.fillOpacity = 0.5,
        this.animation = gsap.to(this, 1, {
            x: (100 * indx),
            y: 150,
            repeat: 10,
            yoyo: true
        });
    }
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = this.fillOpacity;
        ctx.fillStyle = this.fill;
        ctx.fill();
    }
}

let allRects = [];
var yVal = 0;

for(let i=0; i < numRect; i++){
    allRects.push(new myRect(i, yVal))
    yVal += 90;
}

function render() {
  ctx.clearRect(0, 0, w, h);
  allRects.forEach(rect => rect.draw(ctx))
}

// startBtn.addEventListener("click", render, false)
gsap.ticker.add(render);

