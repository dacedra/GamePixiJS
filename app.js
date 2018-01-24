PIXI.utils.sayHello();

var countErrors = 0;
var score = 0;
var foodAmount = 5;
var endGame = false;
var foods = [];


var message;

var apple, cookie, character;

var renderer = PIXI.autoDetectRenderer(512, 512, {
    transparent: true,
    resolution: 1
});


document.getElementById('display').appendChild(renderer.view);

var stage = new PIXI.Container();

PIXI.loader
    .add("spritesheet", "images/Food.png")
    .add("sprit", "images/Food.png")
    .add("knight", "images/knight iso char.png")
    .load(setup);


function setup() {

    //    stage.interactive = true;

    message = new PIXI.Text("Hello!");
    stage.addChild(message);

    var rect = new PIXI.Rectangle(0, 0, 84, 84);
    var texture = PIXI.loader.resources["knight"].texture;
    texture.frame = rect;

    character = new PIXI.Sprite(texture);

    // apple.scale.set(2, 2);
    character.vx = 0;
    character.vy = 0;
    character.anchor.set(0.5, 0.5);
    character.x = renderer.width / 2;
    character.y = 450;


    var iddle = setInterval(function () {
        if (rect.x >= 84 * 3) rect.x = 0;
        character.texture.frame = rect;
        rect.x += 84;
    }, 500);

    stage.addChild(character);




    keysWorks();

    makeFood();

    animationLoop();
}

function animationLoop() {

    if (endGame == false) {
        requestAnimationFrame(animationLoop);

        moveFood();

        if (character.x > 16 && character.x < 491) {
            character.x += character.vx;
        } else if (character.x < 16) {
            character.vx = 0;
            character.x = 17;
        } else {
            character.vx = 0;
            character.x = 490;
        }
        

        hitFood();

        setText();
        gameEnd();
        renderer.render(stage);
    }
}

function makeFood() {



    //        var iddle = setInterval(function() {
    //        if(rect.x >= 84*3) rect.x=0;
    //        apple.texture.frame = rect;
    //        rect.x +=84;
    //    } , 500);

    for (var i = 0; i < foodAmount; i++) {
        var rect1 = new PIXI.Rectangle(0, 64, 16, 16);
        var texture1 = PIXI.loader.resources["spritesheet"].texture;
        texture1.frame = rect1;
        foods[i] = new PIXI.Sprite(texture1);
        foods[i].x = Math.floor((Math.random() * 480) + 16);
        foods[i].y = (50 + (32 * i * 2)) * -1;
        foods[i].vy = Math.random() + 0.5;
        foods[i].scale.set(2, 2);
        rect1.x = Math.floor((Math.random() * 8)) * 16;
        rect1.y = Math.floor((Math.random() * 8)) * 16;
        foods[i].texture.frame = rect1;
        stage.addChild(foods[i]);
    }

}

function moveFood() {
    for (var i = 0; i < foodAmount; i++) {

        if (foods[i].y > 512) {
            countErrors += 1;
            foods[i].y = -32;
            foods[i].x = Math.floor((Math.random() * 480) + 16);
            foods[i].vy = Math.random() + 0.5;
        } else {
            foods[i].y += foods[i].vy;
        }
    }
}


function hitFood() {

    for (var l = 0; l < foodAmount; l++) {

        if (hitTestRectangle(foods[l], character)) {
            foods[l].y = ((Math.floor((Math.random() * 40) + 1)) * -1);
            foods[l].x = Math.floor((Math.random() * 480) + 1);
            foods[l].vx = Math.random() * 2 + 1;
            score += 1;
        }
    }
}

function keysWorks() {

    //Capture the keyboard arrow keys
    let left = keyboard(37),
        right = keyboard(39);


    //Left arrow key `press` method
    left.press = () => {

        character.vx = -5;
        character.vy = 0;

    };

    //Left arrow key `release` method
    left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        if (!right.isDown && character.vy === 0) {
            character.vx = 0;
        }
    };

    //Right
    right.press = () => {

        character.vx = 5;
        character.vy = 0;
    };
    right.release = () => {
        if (!left.isDown && character.vy === 0) {
            character.vx = 0;
        }
    };
}

function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

function setText() {
    message.text = "Score " + score + " Errors " + countErrors;
}

function gameEnd() {
    if (countErrors == 10) {
        endGame = true;
        message.anchor.set(0.5, 0.5);
        message.x = renderer.width / 2;
        message.y = renderer.width / 2;
        message.text = "THE END! Your score " + score;
        stage.removeChild(character);
        for (var i = 0; i < foodAmount; i++) {
            stage.removeChild(foods[i]);
        }
    }
}



function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

            //There's definitely a collision happening
            hit = true;
        } else {

            //There's no collision on the y axis
            hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};

window.addEventListener("keydown", function (event) {
    event.preventDefault();
    character.x += character.vx;
});
