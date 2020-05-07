import gsap from "gsap";
import {canvasConfig, trainEdge, spaceInTrain, animationConfig, numberOfTrains} from "./constants.js"

const {h} = canvasConfig;
const {timeToStation, trainInterval, timeToLeave, timeToBoard} = animationConfig; 

const calcBoardTrainDelay = (train, delay, travelTime) => {
    const base = timeToStation - delay - travelTime;
    return base + (train * trainInterval); 
}

// need to cap this so it doesn't go on after the trains have stopped coming
const calcTimeTilLastTrainLeaves = (delay, travelTime) => {
    const base = timeToStation - delay - travelTime;
    return base + timeToLeave + timeToBoard + (trainInterval * numberOfTrains);
}

const calcTrainPos = () => trainEdge + Math.random() * spaceInTrain;

const setUpAnimation = (particle) => {
    let tl = gsap.timeline()
    const {train, startDelay, travelTime, midX, midY, gettingOn} = particle;

    tl.to(particle, travelTime, {
            x: midX,
            y: midY,
            delay: startDelay,
            ease: "rough"
          }) 
    
    if(gettingOn){
        tl.to(particle, 0.5, {
            x: calcTrainPos(),
            delay: calcBoardTrainDelay(train, startDelay, travelTime), //max out at total time.
            ease: "power1.inOut"
          })
        tl.to(particle, timeToLeave, {
            y: (h - midY) * -1, // move them out at a steady pace ,each covers the same distance
            delay: 0.3,
            ease: "power2.in"
          })
    } 
    if(!gettingOn){
        tl.to(particle, 0.3, {
            delay: calcTimeTilLastTrainLeaves(startDelay, travelTime),
            fill: "red",
            x: midX + Math.random() * 3,
            y: midY + Math.random() * 3,
            yoyo: true,
            repeat: 10
        })
    }
    return tl;
}

export {setUpAnimation};

