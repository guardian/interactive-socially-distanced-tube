import {canvasConfig} from "./constants.js"

const {w, h, doorWidth, doorPosition, doorHeight, doorPadding, stationH, carriageLength, carriagePadding} = canvasConfig;


const roundedRect = (x, y, width, height, radius, ctx) => 
    {
        // Because the function is added to the context prototype
        // the 'this' variable is actually the context
        
        // Save the existing state of the canvas so that it can be restored later
        ctx.save();
        
            // Translate to the given X/Y coordinates
            ctx.translate(x, y);

            // Move to the center of the top horizontal line
            ctx.moveTo(width / 2,0);
            
            // Draw the rounded corners. The connecting lines in between them are drawn automatically
            ctx.arcTo(width,0,width,height, Math.min(height / 2, radius));
            ctx.arcTo(width, height, 0, height, Math.min(width / 2, radius));
            ctx.arcTo(0, height, 0, 0, Math.min(height / 2, radius));
            ctx.arcTo(0, 0, radius, 0, Math.min(width / 2, radius));

            // Draw a line back to the start coordinates
            ctx.lineTo(width / 2,0);

        // Restore the state of the canvas to as it was before the save
        ctx.restore();
    }

const drawDoors = (ctx) => {

    ctx.beginPath();
    ctx.fillStyle = "#EDEDED";
    ctx.roundedRect(w - (doorWidth / 2), (h * doorPosition), doorWidth, doorHeight, 15, ctx);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.roundedRect(w - (doorWidth /2), (h * doorPosition), doorWidth, doorHeight, 15, ctx);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "#EDEDED";
    ctx.roundedRect( 0 - (doorWidth /2), (h * doorPosition), doorWidth, doorHeight, 15, ctx);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.roundedRect( 0 - (doorWidth / 2), (h * doorPosition), doorWidth, doorHeight, 15, ctx);
    ctx.stroke();

}

const drawTrain = (ctx, startX) => {
    ctx.save();
    ctx.fillStyle = "#000";

    ctx.roundedRect(startX, stationH, carriageLength, (h - stationH), 15, ctx);

    ctx.roundedRect(startX + carriageLength + carriagePadding, stationH, carriageLength, (h - stationH), 15, ctx);

    ctx.roundedRect(startX + carriageLength * 2 + carriagePadding * 2, stationH, carriageLength, (h - stationH), 15, ctx);

    ctx.roundedRect(startX + carriageLength * 3 + carriagePadding * 3, stationH, carriageLength, (h - stationH), 15, ctx);
    ctx.stroke()

    ctx.restore();

}

export {roundedRect, drawDoors, drawTrain};

// borrowed from https://www.rgraph.net/canvas/reference/arcto.html