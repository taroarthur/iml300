let duration = 5 * 60 * 1000;
let endTime;

function setup(){

    createCanvas(widdowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    textSize(32);
    textFont('Share Tech Mono');
    endTime = millis() + duration;

}

function draw(){
    
    background(43, 79, 113);
    let remainingTime = endTime - millis();

    if (remainingTime <= 0) {
       window.location.href="end-page.html";
       return;
    }

    let seconds = floor(remainingTime / 1000);
    let minutes = floor(seconds / 60);
    seconds = seconds % 60;
    let timeString = nf(minutes, 2) + ":" + nf(seconds, 2);
    fill(196);
    text(timeString, width / 2);

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}