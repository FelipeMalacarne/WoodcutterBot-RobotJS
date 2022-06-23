/*
Use RuneLite
Marque as arvores e defina sua cor para "ff00ff"
Marque as logs do inventario e defina sua cor para "ff0000"
Fixed Classic resolution in game configuration
A resoluçao da tela de execuçao ainda deve ser 1366x768
*/

var robot = require('robotjs');

const invSlotX = [857, 900, 950, 997,857, 900, 950, 997, 857, 900, 950, 997, 857, 900, 950, 997];
const invSlotY = [250, 250, 250, 250, 285, 285, 285, 285, 320, 320, 320, 320, 355, 355, 355, 355]; 

function main(){

    console.log("Starting...");
    sleep(3000);

    // Apos 7 rotates, ao nao detectar uma arvore, programa acaba
    var rotateMax = 7;
    var rotateCount = 0;
    var slot = 0;
    var slotMax = 15;
    while(true){
        var tree = findTree();
        if (tree == false){
            if(!(rotateCount < rotateMax)){
                break;
            }
            rotateCount++;
            console.log("Rotating camera " + rotateCount + "x");
            rotateCamera();
            continue;
        }
       
        rotateCount = 0;
        sleep(400);

        robot.moveMouse(tree.x, tree.y);
        sleep(200);
        robot.mouseClick();
        
        sleep(1000);

        checkLog(slot);
        slot++;
        if(!(slot < slotMax)){
            dropLogs();
            slot = 0;
        }
    }

    //Auto log Out ao terminar;
    robot.moveMouse(942, 506);
    sleep(200);
    robot.mouseClick();

    robot.moveMouse(939, 456);
    sleep(200);
    robot.mouseClick();

    console.log("Done.");

}

function sleep(ms){
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function findTree(){
    var x = 293, y = 36, widthFinal = 785, heightFinal = 324;
    var img = robot.screen.capture(x, y, widthFinal, heightFinal);

    var tree_colors = ["ff00ff"];

    for(var i = 0; i < 1000; i++){
        var randomX = getRandomInt(0, widthFinal-1);
        var randomY = getRandomInt(0, heightFinal-1);
        var cor_amostra = img.colorAt(randomX, randomY);

        if(tree_colors.includes(cor_amostra)){
            var screenX = randomX + x;
            var screenY = randomY + y;

            console.log("found a tree at:" + screenX + ", " + screenY);
            return{x: screenX, y: screenY};
        }
    }
     //Nao encontrou a arvore na screenshot
        return false;
}

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function rotateCamera(){
        robot.keyToggle("right", "down");
        sleep(1000);
        robot.keyToggle("right", "up");
    }

    function checkLog(proxSlot){
        var proxSlot;
        var pixelColor = robot.getPixelColor(invSlotX[proxSlot],invSlotY[proxSlot]);
        var invLogColor = "ff0000"; 

        // Prende a funcao ate coletar a log com sucesso
        var ciclosEspera = 0;
        var maxCiclos = 15;
        while(pixelColor != invLogColor && ciclosEspera < maxCiclos){
            sleep(1000);
            pixelColor = robot.getPixelColor(invSlotX[proxSlot], invSlotY[proxSlot]);
            ciclosEspera++;
        }
        console.log("Log no slot " + proxSlot + " detectada");
    }

    function dropLogs(){

        robot.keyToggle("shift", "down");

        for(var i = 0; i < 15; i++){
        robot.moveMouse(invSlotX[i], invSlotY[i]);
        sleep (600);
        robot.mouseClick();
        sleep(100);
        }

        robot.keyToggle("shift", "up");
 
    }  

main();
