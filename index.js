/*
Use RuneLite
Marque as arvores e defina sua cor para "ff00ff"
Marque as logs do inventario e defina sua cor para "ff0000"
*/

var robot = require('robotjs');

function main(){

    console.log("Starting...");
    sleep(3000);

    while(true){
        var tree = findTree();
        if (tree == false){
            rotateCamera();
            continue;
        }
       
        sleep(400);

        robot.moveMouse(tree.x, tree.y);
        sleep(200);
        robot.mouseClick();
        
        sleep(3000);

        dropLogs();

    }

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

            console.log("found a tree at:" + screenX + ", " + screenY + " color" + cor_amostra);
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
        console.log("Rotating camera");
        robot.keyToggle("right", "down");
        sleep(1000);
        robot.keyToggle("right", "up");
    }

    function dropLogs(){
        var invSlotX = 919;
        var invSlotY = 253;
        var pixelColor = robot.getPixelColor(invSlotX, invSlotY);
        var invLogColor = "ff0000"; 

        // Prende a funcao ate coletar a log com sucesso
        var ciclosEspera = 0;
        var maxCiclos = 15;
        while(pixelColor != invLogColor && ciclosEspera < maxCiclos){
            sleep(1000);
            pixelColor = robot.getPixelColor(invSlotX, invSlotY);
            ciclosEspera++;
        }
        
        // dropa o primeiro slot se a cor for encontrada
        if(pixelColor == invLogColor){
            robot.keyToggle("shift", "down");
            robot.moveMouse(invSlotX, invSlotY);
            robot.mouseClick();
            robot.keyToggle("shift", "down");
        }
        
       // console.log("invetory log color is: " + pixelColor);
    }

main();
