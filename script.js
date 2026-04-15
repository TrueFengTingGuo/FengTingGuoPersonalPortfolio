

//painting slider
const paintingGallery = document.querySelector(".painting-gallery"); //find gallery-slider from index.html
const sliderContainer = document.querySelector(".gallery-slider"); //find gallery-slider from index.html
const slides = sliderContainer.children;
let containerWidth = sliderContainer.clientWidth; //width of the gallery-slider div
const paintingGalleryWidth = paintingGallery.clientWidth; //width of the gallery-slider div

/**
 * Finding width of a html element:
 * 
 * 
 * offsetWidth: It returns the width of an HTML element including padding, 
 * border and scrollbar in pixels but it does not include margin width. 
 * If the element does not have any associated layout box then it returns zero.
 * 
 * 
 * clientWidth: It returns the width of an HTML element including padding in pixels but does not include margin, 
 * border and scrollbar width.
 * 
 */

const margin = 30;

let itemPerSlide = 0; //how many images it can display in one slide
let slideDots;

// responsive
const responsive = [ //save an dictionary for how many image to display on one slide
    //min width to display more item 
    { breakPoint: { width: 0, item: 1 } },
    { breakPoint: { width: 991, item: 2 } },
    { breakPoint: { width: 1300, item: 3 } }
]

async function load() {


    for (let i = 0; i < responsive.length; i++) {

        //loop through all min width to find the best itemPerSlide value
        if (window.innerWidth > responsive[i].breakPoint.width) { //innerWidth is the width of the webpage (px)

            itemPerSlide = responsive[i].breakPoint.item;

        }

    }
    await generateGallery();
    start(); //go to start function

}

function start() {

    totalWidth = 0;

    //set width of each image
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.width = (paintingGalleryWidth / itemPerSlide) - margin + "px"; // add width (width of the entire image display place / the number of image can be displayed )
        slides[i].style.margin = margin / 2 + "px"; //  set margin to all four values of the margin



        totalWidth += paintingGalleryWidth / itemPerSlide;

    }

    sliderContainer.style.width = totalWidth + "px"; //set the width of the displace div 


    slideDots = Math.ceil(slides.length / itemPerSlide); //calculate how many dots need to display at the bottom

    //slide dot creation process
    for (let i = 0; i < slideDots; i++) {

        const div = document.createElement("div");//create a new div object

        div.id = i;
        div.setAttribute("onclick", "controlSlide(this)"); //set a function when clicked
        if (i == 0) {
            div.classList.add("active");
        }

        document.querySelector(".slide-controls").appendChild(div);//add it to the slide controls div
    }
}

//auto slide the display image page
let currentSlide = 0;
let autoSlide = 0;

function controlSlide(element) {
    clearInterval(timer) //The clearInterval() method clears a timer set with the setInterval() method.
    timer = setInterval(autoPlay, 5000);
    autoSlide = element.id;
    currentSlide = element.id;
    changeSlide(currentSlide)
}

function changeSlide(currentSlide) {
    controlButtons = document.querySelector(".slide-controls").children;

    for (let i = 0; i < controlButtons.length; i++) {
        controlButtons[i].classList.remove("active") //The classList property returns the class name(s) of an element, as a DOMTokenList object. This property is useful to add, remove and toggle CSS classes on an element.
    }

    controlButtons[currentSlide].classList.add("active")

    sliderContainer.style.marginLeft = -(paintingGalleryWidth * currentSlide) + "px"; //set the style, the transition property will then trans to the proper position
}

//autp play the slide
function autoPlay() {

    if (!slideDots || slideDots === 0) return; // gallery not ready yet

    if (autoSlide == slideDots - 1) {
        autoSlide = 0;
    }
    else {
        autoSlide++;
    }

    changeSlide(autoSlide) //input the id of the slide
}


async function generateGallery() {

    const gallery = document.querySelector('.gallery-slider');

    const apiUrl = 'https://api.github.com/repos/TrueFengTingGuo/FengTingGuoPersonalPortfolio/contents/Images/paintings';

    let imageFiles = [];

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('API request failed: ' + response.status);
        const files = await response.json();

        // Filter to only image files by extension
        const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
        imageFiles = files
            .filter(file => file.type === 'file' && imageExtensions.test(file.name))
            .map(file => file.name);
    } catch (err) {
        console.error('Could not load paintings from GitHub API:', err);
    }

    // String template for each item
    const itemTemplate =
        '<div class="item">' +
        '<img src="Images/paintings/{filename}" alt="painting">' +
        '<div class="overlay">' +
        '<h1>Reference found from internet</h1>' +
        '</div>' +
        '</div>';

    let html = '';
    for (let i = 0; i < imageFiles.length; i++) {
        html += itemTemplate.replace('{filename}', imageFiles[i]);
    }
    gallery.innerHTML += html;
}



let timer = setInterval(autoPlay, 2000);

window.onload = load;

// header fixed

window.onscroll = function () {

    const docScrollTop = document.documentElement.scrollTop;

    if (window.innerWidth > 991) {
        if (docScrollTop > 100) {
            document.querySelector("header").classList.add("fixed")
        }
        else {
            document.querySelector("header").classList.remove("fixed")
        }
    }
}

// ---- Pixel Art Cat Pet - State Machine ----
//
// States: idle → run → jump → fall → idle/run
//
//  idle : wanders slowly to random targets; transitions to RUN when mouse moves,
//         or to JUMP on a random timer
//  run  : chases mouse cursor; transitions to IDLE when mouse is still,
//         or to JUMP on a random timer
//  jump : ascending phase of a parabolic arc toward a target; gravity applied each
//         frame; transitions to FALL when vy flips positive (peak reached)
//  fall : descending phase; transitions back to IDLE or RUN on landing
//
// Clicking anywhere launches the cat to that point via a curved arc.

window.addEventListener('DOMContentLoaded', function () {
    const pet = document.getElementById('pet');
    const canvas = document.getElementById('cat-canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const SPRITE_W = 32, SPRITE_H = 32, SCALE = 2;
    const CAT_W = SPRITE_W * SCALE, CAT_H = SPRITE_H * SCALE;

    // Downward acceleration applied during jump / fall  (px / s²)
    const GRAVITY = 900;

    // Minimum distance (px) between cat centre and jump target to allow a jump
    const MIN_JUMP_DIST = 80;

    // Sprite sheet definitions
    const SPRITES = {
        idle: { file: 'Images/Animations/Cat/1_Cat_Idle-Sheet.png', frames: 8, fps: 8 },
        run: { file: 'Images/Animations/Cat/2_Cat_Run-Sheet.png', frames: 10, fps: 12 },
        jump: { file: 'Images/Animations/Cat/3_Cat_Jump-Sheet.png', frames: 4, fps: 10 },
        fall: { file: 'Images/Animations/Cat/4_Cat_Fall-Sheet.png', frames: 4, fps: 10 },
    };
    Object.keys(SPRITES).forEach(key => {
        const img = new Image();
        img.src = SPRITES[key].file;
        SPRITES[key].img = img;
    });

    // Cat position and velocity
    let catX = window.innerWidth / 2 - CAT_W / 2;
    let catY = window.innerHeight / 2 - CAT_H / 2;
    let vx = 0, vy = 0;
    let facingLeft = false;

    // Mouse tracking
    let mouseX = catX + CAT_W / 2;
    let mouseY = catY + CAT_H / 2;
    let lastMoveTime = 0;

    // Wander sub-state (used while idle)
    let wanderTargetX = catX, wanderTargetY = catY;
    let wanderTimer = 0;

    // Jump sub-state
    let jumpTargetX = 0, jumpTargetY = 0;
    let jumpTimer = 0, jumpDuration = 0;

    // Timer until the next autonomous jump
    let nextJumpTimer = 3 + Math.random() * 3;

    // Logic state  ('idle' | 'run' | 'jump' | 'fall') – drives movement rules
    let state = 'idle';

    // Animation state  – derived from logic state + actual speed; drives sprite selection
    // idle/run logic states map to 'idle' sprite when nearly still, 'run' sprite when moving
    let animState = 'idle';

    // Animation frame tracking
    let frameIndex = 0, frameTimer = 0;

    // ------------------------------------------------------------------
    // enterState  –  the single place that drives all state transitions
    // ------------------------------------------------------------------
    function enterState(newState, data) {
        state = newState;
        frameIndex = 0;
        frameTimer = 0;

        if (newState === 'jump' && data) {
            // data: { tx, ty }  –  world-space centre of the jump target
            jumpTargetX = data.tx;
            jumpTargetY = data.ty;
            jumpTimer = 0;

            const cx = catX + CAT_W / 2;
            const cy = catY + CAT_H / 2;
            const dx = jumpTargetX - cx;
            const dy = jumpTargetY - cy;
            const dist = Math.hypot(dx, dy);

            // Choose a flight time that scales with distance
            //   – short hops: ~0.55 s,  long arcs: ~1.6 s
            const T = Math.max(0.55, Math.min(1.6, dist / 320));
            jumpDuration = T;

            // Constant horizontal velocity to reach target in exactly T seconds
            vx = dx / T;

            // Vertical: solve cy + vy0·T + ½·g·T² = jumpTargetY
            //   vy0 = (dy − ½·g·T²) / T
            // This naturally produces an upward kick; clamp to guarantee visible arc.
            vy = (dy - 0.5 * GRAVITY * T * T) / T;
            if (vy > -120) vy = -120;          // always go upward first
        }
    }

    // Pick a new random wander destination
    function pickWanderTarget() {
        const maxX = window.innerWidth - CAT_W;
        const maxY = window.innerHeight - CAT_H;
        wanderTargetX = 50 + Math.random() * Math.max(0, maxX - 100);
        wanderTargetY = 50 + Math.random() * Math.max(0, maxY - 100);
        wanderTimer = 2 + Math.random() * 3;
    }
    pickWanderTarget();

    window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMoveTime = Date.now();
    });

    // Click anywhere → launch cat to that point via a curved jump
    window.addEventListener('click', function (e) {
        if (state !== 'jump' && state !== 'fall') {
            const cdist = Math.hypot(e.clientX - (catX + CAT_W / 2), e.clientY - (catY + CAT_H / 2));
            if (cdist >= MIN_JUMP_DIST) {
                enterState('jump', { tx: e.clientX, ty: e.clientY });
            }
        }
    });

    // ------------------------------------------------------------------
    // Rendering helpers
    // ------------------------------------------------------------------
    function renderFrame() {
        const spr = SPRITES[animState];
        if (!spr || !spr.img.complete || !spr.img.naturalWidth) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const sx = frameIndex * SPRITE_W;
        if (facingLeft) {
            ctx.save();
            ctx.translate(CAT_W, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(spr.img, sx, 0, SPRITE_W, SPRITE_H, 0, 0, CAT_W, CAT_H);
            ctx.restore();
        } else {
            ctx.drawImage(spr.img, sx, 0, SPRITE_W, SPRITE_H, 0, 0, CAT_W, CAT_H);
        }
    }

    // ------------------------------------------------------------------
    // Main loop
    // ------------------------------------------------------------------
    let lastTime = null;

    function loop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;

        const now = Date.now();
        const maxX = window.innerWidth - CAT_W;
        const maxY = window.innerHeight - CAT_H;
        const isChasing = lastMoveTime > 0 && (now - lastMoveTime) < 1500;

        // ------------------------------------------------------------------
        // State machine  –  update velocity / detect transitions each frame
        // ------------------------------------------------------------------
        switch (state) {

            // ── IDLE ──────────────────────────────────────────────────────
            case 'idle': {
                wanderTimer -= dt;
                nextJumpTimer -= dt;

                const tdx = wanderTargetX - catX;
                const tdy = wanderTargetY - catY;
                const tdist = Math.hypot(tdx, tdy);
                if (tdist < 20 || wanderTimer <= 0) pickWanderTarget();

                const wSpd = 55;
                vx += ((tdx / Math.max(tdist, 1)) * wSpd - vx) * 2.5 * dt;
                vy += ((tdy / Math.max(tdist, 1)) * wSpd - vy) * 2.5 * dt;

                if (isChasing) { enterState('run'); break; }

                if (nextJumpTimer <= 0) {
                    nextJumpTimer = 4 + Math.random() * 4;
                    const jtx = wanderTargetX + CAT_W / 2;
                    const jty = wanderTargetY + CAT_H / 2;
                    const jdist = Math.hypot(jtx - (catX + CAT_W / 2), jty - (catY + CAT_H / 2));
                    if (jdist >= MIN_JUMP_DIST) {
                        enterState('jump', { tx: jtx, ty: jty });
                        break;
                    }
                }
                break;
            }

            // ── RUN ───────────────────────────────────────────────────────
            case 'run': {
                nextJumpTimer -= dt;

                const tdx = mouseX - (catX + CAT_W / 2);
                const tdy = mouseY - (catY + CAT_H / 2);
                const tdist = Math.hypot(tdx, tdy);
                const spd = 260;

                if (tdist > 8) {
                    vx += (tdx / tdist * spd - vx) * 9 * dt;
                    vy += (tdy / tdist * spd - vy) * 9 * dt;
                } else {
                    vx *= 0.75;
                    vy *= 0.75;
                }

                if (!isChasing) { enterState('idle'); break; }

                if (nextJumpTimer <= 0) {
                    nextJumpTimer = 2.5 + Math.random() * 3;
                    const mdist = Math.hypot(mouseX - (catX + CAT_W / 2), mouseY - (catY + CAT_H / 2));
                    if (mdist >= MIN_JUMP_DIST) {
                        enterState('jump', { tx: mouseX, ty: mouseY });
                        break;
                    }
                }
                break;
            }

            // ── JUMP (ascending arc) ──────────────────────────────────────
            case 'jump': {
                vy += GRAVITY * dt;   // gravity pulls downward
                jumpTimer += dt;

                // Peak reached → switch to fall sprite
                if (vy >= 0) {
                    enterState('fall');
                    break;
                }

                // Safety: if we somehow overshoot the expected duration, land
                if (jumpTimer > jumpDuration + 0.5) {
                    vy = 0; vx = 0;
                    catX = Math.max(0, Math.min(maxX, jumpTargetX - CAT_W / 2));
                    catY = Math.max(0, Math.min(maxY, jumpTargetY - CAT_H / 2));
                    nextJumpTimer = 2.5 + Math.random() * 3;
                    enterState(isChasing ? 'run' : 'idle');
                }
                break;
            }

            // ── FALL (descending arc) ─────────────────────────────────────
            case 'fall': {
                vy += GRAVITY * dt;
                jumpTimer += dt;

                const cx = catX + CAT_W / 2;
                const cy = catY + CAT_H / 2;
                const distToTarget = Math.hypot(cx - jumpTargetX, cy - jumpTargetY);

                // Land when close to target or when time budget expires
                if (distToTarget < 50 || jumpTimer > jumpDuration + 0.6) {
                    vy = 0; vx = 0;
                    catX = Math.max(0, Math.min(maxX, jumpTargetX - CAT_W / 2));
                    catY = Math.max(0, Math.min(maxY, jumpTargetY - CAT_H / 2));
                    nextJumpTimer = 2.5 + Math.random() * 3;
                    enterState(isChasing ? 'run' : 'idle');
                }
                break;
            }
        }

        // ------------------------------------------------------------------
        // Position integration
        // ------------------------------------------------------------------
        catX += vx * dt;
        catY += vy * dt;

        if (state === 'idle' || state === 'run') {
            // Simple bounce off viewport edges
            if (catX < 0) { catX = 0; vx = Math.abs(vx); }
            if (catX > maxX) { catX = maxX; vx = -Math.abs(vx); }
            if (catY < 0) { catY = 0; vy = Math.abs(vy); }
            if (catY > maxY) { catY = maxY; vy = -Math.abs(vy); }
        } else {
            // During ballistic arc: horizontal bounce, force-land if out of bounds
            if (catX < 0) { catX = 0; vx = Math.abs(vx); }
            if (catX > maxX) { catX = maxX; vx = -Math.abs(vx); }
            if (catY < 0) { catY = 0; vy = Math.abs(vy); }
            if (catY > maxY) {
                catY = maxY;
                vy = 0; vx = 0;
                nextJumpTimer = 2 + Math.random() * 3;
                enterState(isChasing ? 'run' : 'idle');
            }
        }

        // ------------------------------------------------------------------
        // Facing direction, animation advance, render
        // ------------------------------------------------------------------
        if (Math.abs(vx) > 10) facingLeft = vx < 0;

        // Derive animation state from logic state + actual speed
        // jump/fall always use their own sprites; idle/run ground states use
        // 'run' sprite when moving (speed > 20 px/s) and 'idle' when still.
        const speed = Math.hypot(vx, vy);
        const newAnimState = (state === 'jump' || state === 'fall')
            ? state
            : (speed > 20 ? 'run' : 'idle');
        if (newAnimState !== animState) {
            animState = newAnimState;
            frameIndex = 0;
            frameTimer = 0;
        }

        const spr = SPRITES[animState];
        frameTimer += dt;
        const frameDur = 1 / spr.fps;
        while (frameTimer >= frameDur) {
            frameTimer -= frameDur;
            frameIndex = (frameIndex + 1) % spr.frames;
        }

        renderFrame();
        pet.style.left = catX + 'px';
        pet.style.top = catY + 'px';

        requestAnimationFrame(loop);
    }

    pet.style.left = catX + 'px';
    pet.style.top = catY + 'px';
    requestAnimationFrame(loop);
});


/* ============================================================
   Fluid + Ripple Background
   - 2D wave height-field simulation
   - Mouse MOVE  → smooth fluid-flow disturbance (directional dipole)
   - Mouse CLICK → expanding circular ripple
   - Color palette: deep navy base, cyan peaks, purple troughs
   ============================================================ */
(function () {
    const canvas = document.getElementById('fluid-bg');
    const ctx = canvas.getContext('2d');

    // Off-screen canvas used to blit the low-res simulation → full screen
    const buf = document.createElement('canvas');
    const bctx = buf.getContext('2d');

    // Simulation grid resolution relative to canvas pixels
    const SCALE = 3;           // 1 sim cell = SCALE css pixels
    const DAMPING = 0.984;     // energy loss per step

    // Fluid (mouse-move) parameters
    const FLUID_RADIUS   = 7;   // sim-cell radius of each fluid push
    const FLUID_STRENGTH = 200; // peak disturbance strength for fluid

    // Ripple (mouse-click) parameters
    const RIPPLE_RADIUS   = 14;  // sim-cell radius of click ripple
    const RIPPLE_STRENGTH = 110; // disturbance strength for click ripple

    let cols, rows;
    let curr, prev;             // Float32Array height buffers
    let imgData;

    // --- Colour palette (navy → cyan peaks / purple troughs) ---
    // Natural spring water palette
    const BASE_R = 6, BASE_G = 38, BASE_B = 34;      // deep still water
    const PEAK_R = 155, PEAK_G = 255, PEAK_B = 210;   // sparkling surface highlight
    const TROUGH_R = 0, TROUGH_G = 90, TROUGH_B = 72; // shadowed depth

    function init() {
        const W = window.innerWidth;
        const H = window.innerHeight;

        // Size the visible canvas to the full viewport
        canvas.width = W;
        canvas.height = H;

        // Simulation grid is at lower resolution for performance
        cols = Math.ceil(W / SCALE);
        rows = Math.ceil(H / SCALE);

        // Size the off-screen buffer to the simulation grid
        buf.width = cols;
        buf.height = rows;

        curr = new Float32Array(cols * rows);
        prev = new Float32Array(cols * rows);
        imgData = bctx.createImageData(cols, rows);

        // Pre-fill alpha channel (fully opaque)
        for (let i = 3; i < imgData.data.length; i += 4) {
            imgData.data[i] = 255;
        }
    }

    // Add a circular disturbance at grid cell (gx, gy)
    function disturb(gx, gy, radius, strength) {
        const r2 = radius * radius;
        const x0 = Math.max(0, gx - radius) | 0;
        const x1 = Math.min(cols - 1, gx + radius) | 0;
        const y0 = Math.max(0, gy - radius) | 0;
        const y1 = Math.min(rows - 1, gy + radius) | 0;
        for (let y = y0; y <= y1; y++) {
            for (let x = x0; x <= x1; x++) {
                const dx = x - gx, dy = y - gy;
                if (dx * dx + dy * dy <= r2) {
                    curr[y * cols + x] += strength;
                }
            }
        }
    }

    // Advance wave one timestep
    function step() {
        const next = prev; // reuse old buffer to avoid allocation
        for (let y = 1; y < rows - 1; y++) {
            for (let x = 1; x < cols - 1; x++) {
                const i = y * cols + x;
                next[i] = (
                    curr[i - 1] +
                    curr[i + 1] +
                    curr[i - cols] +
                    curr[i + cols]
                ) * 0.5 - next[i];
                next[i] *= DAMPING;
            }
        }
        // Swap buffers
        prev = curr;
        curr = next;
    }

    // Render height field to ImageData then scale-blit to main canvas
    function render() {
        const d = imgData.data;
        for (let i = 0, p = 0; i < cols * rows; i++, p += 4) {
            const h = curr[i];
            if (h > 0) {
                const t = Math.min(h / 120, 1);
                d[p]     = BASE_R + (PEAK_R - BASE_R) * t | 0;
                d[p + 1] = BASE_G + (PEAK_G - BASE_G) * t | 0;
                d[p + 2] = BASE_B + (PEAK_B - BASE_B) * t | 0;
            } else {
                const t = Math.min(-h / 120, 1);
                d[p]     = BASE_R + (TROUGH_R - BASE_R) * t | 0;
                d[p + 1] = BASE_G + (TROUGH_G - BASE_G) * t | 0;
                d[p + 2] = BASE_B + (TROUGH_B - BASE_B) * t | 0;
            }
        }
        // Write pixels to the off-screen buffer, then scale up to fill the display canvas
        bctx.putImageData(imgData, 0, 0);
        ctx.drawImage(buf, 0, 0, cols, rows, 0, 0, canvas.width, canvas.height);
    }

    function loop() {
        step();
        render();
        requestAnimationFrame(loop);
    }

    // --- Input handling ---
    let lastPx = -1, lastPy = -1;

    // Mouse MOVE → fluid-flow effect (interpolated directional dipole trail)
    function onPointerMove(px, py) {
        if (lastPx < 0) {
            lastPx = px;
            lastPy = py;
            return;
        }

        const vx   = px - lastPx;
        const vy   = py - lastPy;
        const dist = Math.hypot(vx, vy);

        if (dist > 0.5) {
            const nx = vx / dist;
            const ny = vy / dist;
            const offset = Math.max(1, (FLUID_RADIUS * 0.5) | 0);

            // Space disturbance points ~(FLUID_RADIUS * SCALE) px apart so
            // fast movement fills the gap with a continuous streak instead of
            // isolated blobs that look like ripples.
            const stepPx = FLUID_RADIUS * SCALE * 0.9;
            const steps  = Math.max(1, Math.ceil(dist / stepPx));

            // Total energy scales mildly with distance but is spread across
            // all interpolated points so each individual disturbance stays small.
            const totalStrength = Math.min(dist * 3.5, FLUID_STRENGTH);
            const strength      = totalStrength / steps;

            for (let s = 0; s < steps; s++) {
                const t  = (s + 0.5) / steps;
                const ix = ((lastPx + vx * t) / SCALE) | 0;
                const iy = ((lastPy + vy * t) / SCALE) | 0;
                // Positive push ahead of cursor, negative wake behind → fluid look
                disturb(ix + (nx * offset | 0), iy + (ny * offset | 0), FLUID_RADIUS,  strength);
                disturb(ix - (nx * offset | 0), iy - (ny * offset | 0), FLUID_RADIUS, -strength * 0.6);
            }
        }

        lastPx = px;
        lastPy = py;
    }

    // Mouse CLICK → circular ripple expanding outward
    function onPointerClick(px, py) {
        const gx = (px / SCALE) | 0;
        const gy = (py / SCALE) | 0;
        disturb(gx, gy, RIPPLE_RADIUS, RIPPLE_STRENGTH);
    }

    window.addEventListener('mousemove', function (e) {
        onPointerMove(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('click', function (e) {
        onPointerClick(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', function (e) {
        const t = e.touches[0];
        onPointerMove(t.clientX, t.clientY);
    }, { passive: true });

    window.addEventListener('touchstart', function (e) {
        const t = e.touches[0];
        onPointerClick(t.clientX, t.clientY);
    }, { passive: true });

    // Re-initialise on resize
    window.addEventListener('resize', function () {
        init();
    });

    // Start
    init();
    loop();
}());
