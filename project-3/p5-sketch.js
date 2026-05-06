// p5.js sketch for index.html background
const sketchCode = (p) => {
    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noStroke();
    }

    p.draw = function() {
        p.background(245, 252, 0); // yellow paper tone

        let cx = p.width * 0.5;
        let cy = p.height * 0.52;

        // mouse reactivity
        let waveAmp = p.map(p.mouseX, 0, p.width, 10, 70);      // distortion
        let ringFreq = p.map(p.mouseY, 0, p.height, 0.015, 0.06); // spacing
        let stripeH = p.map(p.mouseY, 0, p.height, 18, 50);     // thicknss
        let bulge = p.map(p.mouseX, 0, p.width, 0.0008, 0.004);

        
        for (let y = 0; y < p.height; y += 4) {
            for (let x = 0; x < p.width; x += 4) {
                let dx = x - cx;
                let dy = y - cy;
                let d = p.sqrt(dx * dx + dy * dy);

                // Radial wave + spherical bulge distortion
                let radialWave = p.sin(d * ringFreq - p.frameCount * 0.02) * waveAmp;
                let lensWarp = d * bulge * d * 0.02;

                // Warp the horizontal stripe field
                let warpedY = y + radialWave - lensWarp;

                // Hard-edged stripe pattern
                let stripeIndex = p.floor(warpedY / stripeH);
                let isDarkStripe = stripeIndex % 2 === 0;

                if (isDarkStripe) {
                    p.fill(140, 145, 150); // grey
                } else {
                    p.fill(235, 240, 80); // yellow
                }

                p.rect(x, y, 4, 4);
            }
        }

        // Halftone texture overlay
        drawHalftone(cx, cy, ringFreq, waveAmp);
    }

    function drawHalftone(cx, cy, ringFreq, waveAmp) {
        let spacing = 7;
        
        for (let y = 0; y < p.height; y += spacing) {
            for (let x = 0; x < p.width; x += spacing) {
                let dx = x - cx;
                let dy = y - cy;
                let d = p.sqrt(dx * dx + dy * dy);

                // Dot size responds to local radial wave
                let localWave = p.sin(d * ringFreq) * 0.5 + 0.5;
                let dotSize = p.map(localWave, 0, 1, 1, 4);

                p.fill(193, 197, 191);
                p.ellipse(x, y, dotSize, dotSize);
            }
        }
    }

    p.windowResized = function() {
        if (p.windowWidth > 0 && p.windowHeight > 0) {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        }
    }
}

// Initialize p5 sketch when DOM is ready
if (document.getElementById('p5-container')) {
    new p5(sketchCode, 'p5-container');
}
