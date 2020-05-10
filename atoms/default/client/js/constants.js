
// Canvas consts
const canvas = document.querySelector("#normal");
const ctx = canvas.getContext("2d");
const clock = document.querySelector("#clock");
const toggle = document.querySelector("#distance-toggle");
const toggleLabel = document.querySelector("#toggle-label");
const runButton = document.querySelector("#run");


// CHANGE THESE VARIABLES
const numParticles = 1005;
const numberOfTrains = 3; //? 24

const canvasConfig = {
    w : 640,
    h : 300,
    stationW : 580,
    yellowLineOffset : 15,
    yellowLineWidth : 5,
    trainOffset: 25,
    doorPosition1: 0.2,
    doorPosition2: 0.8
}

const {w, h, stationW, yellowLineOffset, yellowLineWidth, trainOffset} = canvasConfig;
const trainW = w - stationW;
const trainEdge = w - (trainW - yellowLineOffset) + trainOffset; // x position of the edge of train plus 10 padding;
const spaceInTrain = trainW - (trainOffset * 2) - yellowLineOffset - yellowLineWidth;

// Particle consts
const particleConfig = {
   particleRadius: 5,
   particleOffset: 10, //offset from top,
   particleColor: "#121212",
   angryParticleColor: "red",
}

const { particleRadius, particleOffset} = particleConfig;
const particleSpacing = particleRadius * 2 + 0.5 * particleRadius;
const numParticlesInCol = Math.floor((h - particleOffset * 2) / particleSpacing);
const numColsInStation = Math.floor((stationW - particleOffset * 2) / particleSpacing);

// Animation consts 
const animationConfig = {
    timeToStation : 5,
    waitForTrain : 2,
    trainInterval : 1.3, 
    timeToLeave : 0.9,
    timeToBoard : 1,
}

const {timeToStation} = animationConfig; 
const timeToStationMs = timeToStation * 1000


export {numParticles, numberOfTrains, 
    canvas, ctx, clock, toggle, toggleLabel, runButton,
    canvasConfig, trainW, trainEdge, spaceInTrain,
    particleConfig, particleSpacing, numParticlesInCol, numColsInStation,
    animationConfig, timeToStationMs}