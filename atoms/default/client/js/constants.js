
// Canvas consts
const canvas = document.querySelector("#normal");
const ctx = canvas.getContext("2d");
const clock = document.querySelector("#clock");
const toggle = document.querySelector("#distance-toggle");
const toggleLabel = document.querySelector("#toggle-label");
const runButton = document.querySelector("#run");


// CHANGE THESE VARIABLES
const numParticles = 1005;
const numberOfTrains = 24; //? 24

const canvasConfig = {
    w : 640,
    h : 400,
    stationH: 325,
    stationW : 580,
    trainOffset: 25,
    doorPosition: 0.05,
    doorWidth: 30,
    doorHeight: 60,
    doorPadding: 5,
    carriageLength: 150,
    carriagePadding: 2,
    numCarriages: 4
}

const {w, h, stationH, trainOffset, doorWidth, doorPadding} = canvasConfig;
const trainH = h - stationH;
const trainEdge = stationH + trainOffset; // x position of the edge of train plus 10 padding;
const spaceInTrain = trainH - (trainOffset * 2);

// Particle consts
const particleConfig = {
   particleRadius: 5,
   particleOffset: 10, //offset from top,
   particleColor: "#121212",
   angryParticleColor: "red",
}

const { particleRadius, particleOffset} = particleConfig;
const particleSpacing = particleRadius * 2 + 0.5 * particleRadius;
const numParticlesInRow = Math.floor((w - (doorWidth + doorPadding + particleOffset) * 2) / particleSpacing);
const numRowsInStation = Math.floor((stationH - particleOffset) / particleSpacing);

// Animation consts 
const animationConfig = {
    timeToStation : 5,
    waitForTrain : 2,
    timeToLeave : 0.9,
    timeToBoard : 0.6,
    trainTimeToArrive: 0.9,
    afterBoardDelay: 0.3
}


const {timeToStation, trainTimeToArrive, timeToBoard, afterBoardDelay, timeToLeave} = animationConfig; 
const timeToStationMs = timeToStation * 1000;
const trainInterval = trainTimeToArrive +  timeToBoard + afterBoardDelay + timeToLeave// add together


export {numParticles, numberOfTrains, 
    canvas, ctx, clock, toggle, toggleLabel, runButton,
    canvasConfig, trainH, trainEdge, spaceInTrain,
    particleConfig, particleSpacing, numParticlesInRow, numRowsInStation,
    animationConfig, timeToStationMs, trainInterval}