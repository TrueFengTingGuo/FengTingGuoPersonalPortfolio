

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
    Water Background – WebGL height-field wave simulation
   - GPU 2D wave equation: h_new = damp*(2*h - h_prev) + c²*∇²h
   - Mouse/touch MOVE  → directional push (anisotropic Gaussian derivative
     aligned with velocity: water piles up ahead, trough trails behind)
   - Mouse/touch CLICK → stronger radial burst
   - Ambient: random drips every ~1.8 s
    - Color palette: blue water with white reflections
   ============================================================ */
(function () {
    'use strict';

    const canvas = document.getElementById('fluid-bg');

    // WebGL2 with RGBA UNSIGNED_BYTE (universally renderable – no extensions needed)
    const gl = canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
    if (!gl) return;

    // ---- Shader sources ----------------------------------------
    const VS_SRC = `
attribute vec2 a_pos;
varying   vec2 v_uv;
void main() {
    v_uv        = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

    // Simulation: 2-D wave equation on every texel
    // Heights are stored as UNSIGNED_BYTE RGBA: R encodes float [-1,1] → [0,1]
    // decode: h = r * 2.0 - 1.0    encode: r = h * 0.5 + 0.5
    // Mouse disturbances use an anisotropic Gaussian *derivative* aligned with
    // the velocity vector: water is pushed ahead (+) and a trough trails behind (-),
    // just like dragging a hand through water.  Static drops (clicks, ambient) keep
    // the original radial Gaussian shape.
    const SIM_FS = `
precision highp float;
uniform sampler2D u_curr;
uniform sampler2D u_prev;
uniform vec2      u_res;
uniform vec2      u_drops[8];
uniform vec2      u_dropVel[8];
uniform float     u_dropStr[8];
uniform int       u_dropCount;
varying vec2 v_uv;
float dec(vec2 uv) { return texture2D(u_curr, uv).r * 2.0 - 1.0; }
float decP(vec2 uv){ return texture2D(u_prev, uv).r * 2.0 - 1.0; }
void main() {
    vec2  tx   = 1.0 / u_res;
    float c    = dec(v_uv);
    float p    = decP(v_uv);
    float up   = dec(v_uv + vec2(0.0,  tx.y));
    float dn   = dec(v_uv + vec2(0.0, -tx.y));
    float lt   = dec(v_uv + vec2(-tx.x, 0.0));
    float rt   = dec(v_uv + vec2( tx.x, 0.0));
    float lap  = up + dn + lt + rt - 4.0 * c;
    // Slightly stronger propagation while keeping a soft decay
    float next = 0.989 * (2.0 * c - p) + 0.21 * lap;
    for (int i = 0; i < 8; i++) {
        if (i >= u_dropCount) break;
        vec2  d   = v_uv - u_drops[i];
        vec2  vel = u_dropVel[i];
        float vlen = length(vel);
        if (vlen > 0.0005) {
            // Directional push: derivative of anisotropic Gaussian along motion.
            // Elongated along the motion axis (spar) and narrow across it (sperp).
            // Sigma is in pixel space (converted to UV) so splash size is resolution-independent.
            vec2  vn     = vel / vlen;
            float d_par  = dot(d, vn);
            float d_perp = d.x * vn.y - d.y * vn.x;
            float spar   = 28.0 / u_res.x;   // ~28 px regardless of screen width
            float sperp  = 12.0 / u_res.y;   // ~12 px regardless of screen height
            float gauss  = exp(-(d_par  * d_par  / (2.0 * spar  * spar ) +
                                  d_perp * d_perp / (2.0 * sperp * sperp)));
            next += u_dropStr[i] * (d_par / spar) * gauss;
        } else {
            // Static click / ambient drop: ~12 px sigma, resolution-independent
            float sig = 12.0 / u_res.x;
            next += u_dropStr[i] * exp(-dot(d, d) / (2.0 * sig * sig));
        }
    }
    float enc = clamp(next, -1.0, 1.0) * 0.5 + 0.5;
    gl_FragColor = vec4(enc, 0.0, 0.0, 1.0);
}`;

    // Render: height → surface normal → watercolour-painted surface
    const RENDER_FS = `
precision highp float;
uniform sampler2D u_curr;
uniform vec2      u_res;
varying vec2 v_uv;
float dec(vec2 uv) { return texture2D(u_curr, uv).r * 2.0 - 1.0; }
void main() {
    vec2  tx    = 1.0 / u_res;
    float h     = dec(v_uv);
    float hR    = dec(v_uv + vec2(tx.x, 0.0));
    float hU    = dec(v_uv + vec2(0.0,  tx.y));
    // Shallow normal scale → soft, matte surface (watercolour has no gloss)
    vec3  norm  = normalize(vec3(-(hR - h) * 42.0, -(hU - h) * 42.0, 1.0));
    vec3  light = normalize(vec3(0.3, 0.55, 1.0));
    float diff  = max(dot(norm, light), 0.0);
    // Very broad, faint specular – watercolour paper has minimal sheen
    vec3  hlf   = normalize(light + vec3(0.0, 0.0, 1.0));
    float spec  = pow(max(dot(norm, hlf), 0.0), 18.0);
    // Lake palette: softer blue-green tones with lighter highlights
    vec3 deep  = vec3(0.420, 0.620, 0.640);
    vec3 mid   = vec3(0.620, 0.820, 0.840);
    vec3 crest = vec3(0.960, 1.000, 0.980);
    vec3 specC = vec3(1.000, 1.000, 1.000);
    float t    = clamp(h * 3.0 + 0.2, 0.0, 1.0);
    vec3  col  = mix(deep, mid,  clamp(t * 1.5, 0.0, 1.0));
    col        = mix(col,  crest, clamp((t - 0.4) * 2.0, 0.0, 1.0));
    // Balanced ambient – enough darkness to show the colour, matte finish
    col        = col * (0.82 + 0.18 * diff) + specC * spec * 0.08;
    // Soft pigment-pooling darkening at wave troughs
    col       *= 1.0 - clamp(-h * 0.35, 0.0, 0.10);
    gl_FragColor = vec4(col, 1.0);
}`;

    // ---- GL helpers --------------------------------------------
    function compileShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
            console.error('Shader compile error:', gl.getShaderInfoLog(s));
        return s;
    }
    function buildProgram(fsSrc) {
        const prog = gl.createProgram();
        gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VS_SRC));
        gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSrc));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
            console.error('Program link error:', gl.getProgramInfoLog(prog));
        return prog;
    }

    const simProg = buildProgram(SIM_FS);
    const renderProg = buildProgram(RENDER_FS);

    // Cache uniform locations once (looking them up every frame is wasteful)
    const simU = {
        curr:      gl.getUniformLocation(simProg, 'u_curr'),
        prev:      gl.getUniformLocation(simProg, 'u_prev'),
        res:       gl.getUniformLocation(simProg, 'u_res'),
        drops:     gl.getUniformLocation(simProg, 'u_drops'),
        dropVel:   gl.getUniformLocation(simProg, 'u_dropVel'),
        dropStr:   gl.getUniformLocation(simProg, 'u_dropStr'),
        dropCount: gl.getUniformLocation(simProg, 'u_dropCount'),
    };
    const renderU = {
        curr: gl.getUniformLocation(renderProg, 'u_curr'),
        res:  gl.getUniformLocation(renderProg, 'u_res'),
    };

    // Full-screen quad (TRIANGLE_STRIP)
    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    function bindQuad(prog) {
        const loc = gl.getAttribLocation(prog, 'a_pos');
        gl.enableVertexAttribArray(loc);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    // ---- Textures & FBOs ---------------------------------------
    let W, H;
    let texPrev, texCurr, texNext;
    let fboPrev, fboCurr, fboNext;

    function canRenderToTexture(spec) {
        const tex = gl.createTexture();
        const fbo = gl.createFramebuffer();

        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            spec.internalFormat,
            4,
            4,
            0,
            spec.format,
            spec.type,
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteFramebuffer(fbo);
        gl.deleteTexture(tex);
        return ok;
    }

    function pickSimulationTextureSpec() {
        const isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;

        if (isWebGL2) {
            const colorFloatExt = gl.getExtension('EXT_color_buffer_float');
            if (colorFloatExt) {
                const halfFloatSpec = {
                    internalFormat: gl.RGBA16F,
                    format: gl.RGBA,
                    type: gl.HALF_FLOAT,
                };
                if (canRenderToTexture(halfFloatSpec)) return halfFloatSpec;
            }
        } else {
            const halfFloatExt = gl.getExtension('OES_texture_half_float');
            const colorHalfFloatExt = gl.getExtension('EXT_color_buffer_half_float');
            if (halfFloatExt && colorHalfFloatExt) {
                const halfFloatSpec = {
                    internalFormat: gl.RGBA,
                    format: gl.RGBA,
                    type: halfFloatExt.HALF_FLOAT_OES,
                };
                if (canRenderToTexture(halfFloatSpec)) return halfFloatSpec;
            }
        }

        return {
            internalFormat: gl.RGBA,
            format: gl.RGBA,
            type: gl.UNSIGNED_BYTE,
        };
    }

    const simTexSpec = pickSimulationTextureSpec();

    function makeTex(w, h) {
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            simTexSpec.internalFormat,
            w,
            h,
            0,
            simTexSpec.format,
            simTexSpec.type,
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return t;
    }
    function makeFBO(tex) {
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D, tex, 0);
        return fbo;
    }
    function initBuffers() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        [texPrev, texCurr, texNext].forEach(t => t && gl.deleteTexture(t));
        [fboPrev, fboCurr, fboNext].forEach(f => f && gl.deleteFramebuffer(f));
        texPrev = makeTex(W, H); fboPrev = makeFBO(texPrev);
        texCurr = makeTex(W, H); fboCurr = makeFBO(texCurr);
        texNext = makeTex(W, H); fboNext = makeFBO(texNext);

        // Clear all simulation buffers to flat-water state.
        // Height 0 is encoded as R = 0.5; uninitialized textures contain garbage
        // which causes the bright flicker seen on first load.
        gl.clearColor(0.5, 0.0, 0.0, 1.0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fboPrev);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fboCurr);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fboNext);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    // ---- Disturbance queue -------------------------------------
    const MAX_DROPS = 8;
    let pendingDrops = [];

    // vx, vy are pixel-space velocity; converted to UV space internally.
    // Passing no velocity (or zero) produces a radial Gaussian (clicks, ambient).
    function addDrop(px, py, strength, vx, vy) {
        pendingDrops.push({
            x: px / W, y: 1.0 - py / H, s: strength,
            vx: (vx || 0) / W, vy: -(vy || 0) / H   // UV-space velocity (Y flipped)
        });
        if (pendingDrops.length > MAX_DROPS) pendingDrops.shift();
    }

    // ---- Simulation step ---------------------------------------
    function simStep() {
        gl.useProgram(simProg);
        bindQuad(simProg);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texCurr);
        gl.uniform1i(simU.curr, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texPrev);
        gl.uniform1i(simU.prev, 1);

        gl.uniform2f(simU.res, W, H);

        const count = Math.min(pendingDrops.length, MAX_DROPS);
        const posArr = new Float32Array(MAX_DROPS * 2);
        const velArr = new Float32Array(MAX_DROPS * 2);
        const strArr = new Float32Array(MAX_DROPS);
        for (let i = 0; i < count; i++) {
            posArr[i * 2] = pendingDrops[i].x;
            posArr[i * 2 + 1] = pendingDrops[i].y;
            velArr[i * 2] = pendingDrops[i].vx;
            velArr[i * 2 + 1] = pendingDrops[i].vy;
            strArr[i] = pendingDrops[i].s;
        }
        gl.uniform2fv(simU.drops, posArr);
        gl.uniform2fv(simU.dropVel, velArr);
        gl.uniform1fv(simU.dropStr, strArr);
        gl.uniform1i(simU.dropCount, count);
        pendingDrops = [];

        gl.bindFramebuffer(gl.FRAMEBUFFER, fboNext);
        gl.viewport(0, 0, W, H);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // Ping-pong rotation: prev ← curr ← next ← old prev
        const tmpT = texPrev, tmpF = fboPrev;
        texPrev = texCurr; fboPrev = fboCurr;
        texCurr = texNext; fboCurr = fboNext;
        texNext = tmpT; fboNext = tmpF;
    }

    // ---- Render to screen --------------------------------------
    function renderFrame() {
        gl.useProgram(renderProg);
        bindQuad(renderProg);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texCurr);
        gl.uniform1i(renderU.curr, 0);
        gl.uniform2f(renderU.res, W, H);
        gl.viewport(0, 0, W, H);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // ---- Main loop ---------------------------------------------
    function loop() {
        // Directional water push: pass mouse velocity to the shader so it can
        // compute an anisotropic displaced Gaussian (water pushed ahead, trough behind).
        if (mouseX >= 0) {
            const dist = Math.hypot(mouseX - lastDropX, mouseY - lastDropY);
            if (dist > 6 || lastDropX < 0) {
                if (lastDropX >= 0 && dist > 0) {
                    const vx = mouseX - lastDropX;
                    const vy = mouseY - lastDropY;
                    const speed = Math.hypot(vx, vy);
                    // Strength scales with speed; velocity direction handled in shader
                    const str = Math.min(0.16 + speed * 0.005, 0.55);
                    addDrop(mouseX, mouseY, str, vx, vy);
                } else {
                    // Very first contact – small but clearer seed ripple
                    addDrop(mouseX, mouseY, 0.08);
                }
                lastDropX = mouseX;
                lastDropY = mouseY;
            }
        }
        simStep();
        renderFrame();
        requestAnimationFrame(loop);
    }

    // ---- Input -------------------------------------------------
    // Mouse position is recorded every event but a drop is only injected
    // once per animation frame (inside loop()), preventing burst trails.
    let mouseX = -1, mouseY = -1;
    let lastDropX = -1, lastDropY = -1;

    function onMove(px, py) {
        mouseX = px;
        mouseY = py;
    }
    function onBurst(px, py) { addDrop(px, py, 0.34); }

    window.addEventListener('pointermove',
        e => onMove(e.clientX, e.clientY), { passive: true });
    window.addEventListener('mousemove',
        e => { if (!window.PointerEvent) onMove(e.clientX, e.clientY); },
        { passive: true });
    window.addEventListener('click',
        e => onBurst(e.clientX, e.clientY));
    window.addEventListener('touchmove',
        e => onMove(e.touches[0].clientX, e.touches[0].clientY),
        { passive: true });
    window.addEventListener('touchstart',
        e => onBurst(e.touches[0].clientX, e.touches[0].clientY),
        { passive: true });
    window.addEventListener('resize', () => {
        mouseX = -1; mouseY = -1; lastDropX = -1; lastDropY = -1; initBuffers();
    });

    // Ambient raindrops – smaller and subtler for a drizzle feel
    setInterval(() => {
        addDrop(Math.random() * W, Math.random() * H,
            0.07 + Math.random() * 0.045);
    }, 1800);

    initBuffers();
    loop();
}());
