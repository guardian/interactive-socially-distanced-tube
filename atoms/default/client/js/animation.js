import gsap from "gsap";
import {canvasConfig, spaceInTrain, animationConfig, numberOfTrains, trainInterval} from "./constants.js"

const {w, trainOffset} = canvasConfig;
const {timeToStation, timeToLeave, timeToBoard, trainTimeToArrive, afterBoardDelay} = animationConfig; 

const calcBoardTrainDelay = (train, delay, travelTime) => {
    const base = timeToStation - delay - travelTime;
    return base + (train * trainInterval); 
}

// need to cap this so it doesn't go on after the trains have stopped coming
const calcTimeTilLastTrainLeaves = (delay, travelTime) => {
    const base = timeToStation - delay - travelTime;
    return base + timeToLeave + timeToBoard + (trainInterval * numberOfTrains);
}

const calcTrainPos = () => trainOffset + Math.random() * spaceInTrain;

const setUpAnimation = (particle) => {
    let tl = gsap.timeline()
    const {x, y, train, startDelay, travelTime, gettingOn} = particle;

    tl.to(particle, travelTime, {
            opacity: 1,
            delay: startDelay,
            y: y-2,
            yoyo: true,
          }) 
    
    if(gettingOn){
        tl.to(particle, timeToBoard, {
            y: calcTrainPos(),
            delay: calcBoardTrainDelay(train, startDelay, travelTime), //max out at total time.
            ease: "power1.inOut"
          })
        tl.to(particle, timeToLeave, {
            x: w + x, // move them out at a steady pace ,each covers the same distance
            delay: afterBoardDelay,
            ease: "power2.in"
          })
    } 
    if(!gettingOn){
        console.log("this part ran");
        tl.to(particle, 0.3, {
            delay: calcTimeTilLastTrainLeaves(startDelay, travelTime),
            fill: "red",
            x: x + Math.random() * 3,
            y: y + Math.random() * 3,
            yoyo: true,
            repeat: 10
        })
    }
    tl.pause();
    return tl;
}

const setUpTrainAnimation = (train) => {
    let tl = gsap.timeline();
    const {midX, startDelay, trainNumber} = train;

    //move into platform
    tl.to(train, trainTimeToArrive, {
        x: midX,
        delay: startDelay + (trainInterval * trainNumber), // different for each train
        ease: "power2.out"
    })
    // move out of platform
    tl.to(train, timeToLeave, {
        x: w + midX,
        delay: timeToBoard + afterBoardDelay,
        ease: "power2.in"
    })

}

export {setUpAnimation, setUpTrainAnimation};

