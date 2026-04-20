/* ============================================================
   HERO — letter-by-letter stagger
   ============================================================ */
(function () {
    const nameEl = document.getElementById('hero-name');
    if (!nameEl) return;
    const fullName = 'Feng Ting Guo — Alex';
    let html = '';
    let delay = 0.7; // seconds — starts after greeting animation
    for (let i = 0; i < fullName.length; i++) {
        const ch = fullName[i];
        if (ch === ' ') {
            html += '<span class="char-space" aria-hidden="true"></span>';
        } else {
            html += '<span class="char" style="animation-delay:' + delay.toFixed(3) + 's" aria-hidden="true">'
                + ch.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                + '</span>';
            delay += 0.03;
        }
    }
    nameEl.innerHTML = html;
}());

/* ============================================================
   FLOATING STARS — hero background
   ============================================================ */
(function () {
    const layer = document.getElementById('stars-layer');
    if (!layer) return;
    const count = 55;
    for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        s.className = 'star';
        const size = 1 + Math.random() * 2.5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 18 + Math.random() * 30;
        const dxVal = (Math.random() - 0.5) * 80;
        const dyVal = (Math.random() - 0.5) * 80;
        const dely = Math.random() * -duration; // stagger start
        s.style.cssText =
            'width:' + size + 'px;height:' + size + 'px;' +
            'left:' + x + '%;top:' + y + '%;' +
            '--dx:' + dxVal + 'px;--dy:' + dyVal + 'px;' +
            'animation-duration:' + duration + 's;' +
            'animation-delay:' + dely + 's;';
        layer.appendChild(s);
    }
}());

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
(function () {
    const bar = document.getElementById('scroll-bar');
    const dot = document.getElementById('scroll-dot');
    if (!bar || !dot) return;

    function updateProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
        dot.style.left = pct + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}());

/* ============================================================
   SCROLL INDICATOR — hide past 100vh
   ============================================================ */
(function () {
    const indicator = document.getElementById('scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > window.innerHeight * 0.8) {
            indicator.classList.add('hidden');
        } else {
            indicator.classList.remove('hidden');
        }
    }, { passive: true });
}());

/* ============================================================
   NAVIGATION — frosted glass on scroll + active section
   ============================================================ */
(function () {
    const header = document.getElementById('site-header');
    const links  = document.querySelectorAll('.nav-link');
    const hamburger = document.getElementById('hamburger');
    const navbar    = document.getElementById('navbar');

    // Frosted glass toggle
    window.addEventListener('scroll', function () {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // Active section tracking
    const sections = document.querySelectorAll('section[id], footer[id]');
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                links.forEach(function (link) {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(function (s) { observer.observe(s); });

    // Hamburger toggle
    if (hamburger && navbar) {
        hamburger.addEventListener('click', function () {
            const isOpen = navbar.classList.toggle('open');
            hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });

        // Close on link click (mobile)
        navbar.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navbar.classList.remove('open');
                hamburger.setAttribute('aria-label', 'Open menu');
            });
        });
    }
}());

/* ============================================================
   GENERIC SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
(function () {
    if (!('IntersectionObserver' in window)) {
        // Fallback: show everything
        document.querySelectorAll(
            '.reveal-left,.reveal-img,.reveal-block,.reveal-fade-up,.title-line,.project-card'
        ).forEach(function (el) { el.classList.add('revealed', 'animated'); });
        return;
    }

    function makeObserver(threshold) {
        return new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: threshold });
    }

    // Title lines: use separate observer to trigger width animation
    var lineObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.title-line').forEach(function (el) { lineObs.observe(el); });

    var obs20 = makeObserver(0.15);
    ['.reveal-left', '.reveal-img', '.reveal-block', '.reveal-fade-up', '.project-card'].forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) { obs20.observe(el); });
    });
}());

/* ============================================================
   SKILL BARS — animate width on scroll reveal
   ============================================================ */
(function () {
    var fills = document.querySelectorAll('.skill-fill');
    fills.forEach(function (fill) {
        var w = fill.getAttribute('data-width') || '0';
        fill.style.setProperty('--target-w', w + '%');
    });

    if (!fills.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                fills.forEach(function (fill) { fill.classList.add('animated'); });
                observer.disconnect();
            }
        });
    }, { threshold: 0.2 });

    var skillsSection = document.querySelector('.about-section');
    if (skillsSection) observer.observe(skillsSection);
}());

/* ============================================================
   CONTACT EMAIL — typeout effect
   ============================================================ */
(function () {
    var emailEl = document.getElementById('contact-email');
    if (!emailEl) return;
    var emailText = 'guofengting98@gmail.com';
    var typed = false;

    function typeOut() {
        if (typed) return;
        typed = true;
        var i = 0;
        var interval = setInterval(function () {
            emailEl.textContent = emailText.slice(0, i + 1);
            i++;
            if (i >= emailText.length) clearInterval(interval);
        }, 40);
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                typeOut();
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(emailEl);
}());

/* ============================================================
   PROJECT CARDS — 3D tilt on mousemove
   ============================================================ */
(function () {
    document.querySelectorAll('.project-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top  + rect.height / 2;
            var dx = (e.clientX - cx) / (rect.width  / 2);
            var dy = (e.clientY - cy) / (rect.height / 2);
            card.style.transform = 'translateY(0) scale(1) rotateX(' + (-dy * 6) + 'deg) rotateY(' + (dx * 6) + 'deg)';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });
}());

/* ============================================================
   PAINTING SLIDER — gallery
   ============================================================ */
const paintingGallery  = document.querySelector('.painting-gallery');
const sliderContainer  = document.querySelector('.gallery-slider');
const slides           = sliderContainer.children;
let containerWidth     = sliderContainer.clientWidth;
const paintingGalleryWidth = paintingGallery.clientWidth;

const margin = 30;
let itemPerSlide = 0;
let slideDots;

const responsive = [
    { breakPoint: { width: 0,    item: 1 } },
    { breakPoint: { width: 991,  item: 2 } },
    { breakPoint: { width: 1300, item: 3 } }
];

async function load() {
    for (let i = 0; i < responsive.length; i++) {
        if (window.innerWidth > responsive[i].breakPoint.width) {
            itemPerSlide = responsive[i].breakPoint.item;
        }
    }
    await generateGallery();
    start();
}

function start() {
    let totalWidth = 0;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.width  = (paintingGalleryWidth / itemPerSlide) - margin + 'px';
        slides[i].style.margin = margin / 2 + 'px';
        totalWidth += paintingGalleryWidth / itemPerSlide;
    }
    sliderContainer.style.width = totalWidth + 'px';

    slideDots = Math.ceil(slides.length / itemPerSlide);
    const slideCtrl = document.querySelector('.slide-controls');
    // Clear existing dots before regenerating
    slideCtrl.innerHTML = '';
    for (let i = 0; i < slideDots; i++) {
        const div = document.createElement('div');
        div.id = i;
        div.setAttribute('onclick', 'controlSlide(this)');
        if (i === 0) div.classList.add('active');
        slideCtrl.appendChild(div);
    }
}

let currentSlide = 0;
let autoSlide    = 0;

function controlSlide(element) {
    clearInterval(timer);
    timer = setInterval(autoPlay, 5000);
    autoSlide    = element.id;
    currentSlide = element.id;
    changeSlide(currentSlide);
}

function changeSlide(currentSlide) {
    const controlButtons = document.querySelector('.slide-controls').children;
    for (let i = 0; i < controlButtons.length; i++) {
        controlButtons[i].classList.remove('active');
    }
    controlButtons[currentSlide].classList.add('active');
    sliderContainer.style.marginLeft = -(paintingGalleryWidth * currentSlide) + 'px';
}

function autoPlay() {
    if (!slideDots || slideDots === 0) return;
    autoSlide = (autoSlide >= slideDots - 1) ? 0 : autoSlide + 1;
    changeSlide(autoSlide);
}

async function generateGallery() {
    const gallery  = document.querySelector('.gallery-slider');
    const apiUrl   = 'https://api.github.com/repos/TrueFengTingGuo/FengTingGuoPersonalPortfolio/contents/Images/paintings';
    let imageFiles = [];

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('API request failed: ' + response.status);
        const files = await response.json();
        const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
        imageFiles = files
            .filter(function (f) { return f.type === 'file' && imageExtensions.test(f.name); })
            .map(function (f) { return f.name; });
    } catch (err) {
        console.error('Could not load paintings from GitHub API:', err);
    }

    const itemTemplate =
        '<div class="item">' +
        '<img src="Images/paintings/{filename}" alt="painting" loading="lazy">' +
        '<div class="overlay"><h1>Reference found from internet</h1></div>' +
        '</div>';

    let html = '';
    for (let i = 0; i < imageFiles.length; i++) {
        html += itemTemplate.replace('{filename}', imageFiles[i]);
    }
    gallery.innerHTML += html;
}

let timer = setInterval(autoPlay, 2000);
window.onload = load;

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
    Water Background – Vector-Field Navier-Stokes Fluid Simulation
   - True 2D incompressible Navier-Stokes with velocity vector fields
   - Semi-Lagrangian advection (unconditionally stable)
   - Jacobi pressure solver → divergence-free projection
   - Vorticity confinement  → persistent swirls & eddies
   - Dye tracer for watercolour-style visualisation
   - Mouse MOVE  → velocity + dye splat (produces swirls)
   - Mouse CLICK → radial dye burst
   - Ambient: random coloured drips with random impulse
   ============================================================ */
(function () {
    'use strict';

    const canvas = document.getElementById('fluid-bg');
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    // Enable float texture rendering
    gl.getExtension('EXT_color_buffer_float');

    // ---- Configuration -----------------------------------------
    const SIM_SCALE = 0.5;          // simulation runs at half resolution
    const JACOBI_ITERS = 24;        // pressure solver iterations
    const VORTICITY_STRENGTH = 35;  // vorticity confinement strength
    const VELOCITY_DISSIPATION = 0.995;
    const DYE_DISSIPATION = 0.985;
    const SPLAT_RADIUS = 0.004;     // normalised splat radius

    // ---- Shared vertex shader ----------------------------------
    const VS = `#version 300 es
layout(location = 0) in vec2 a_pos;
out vec2 v_uv;
void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

    // ---- Fragment shaders --------------------------------------

    // Splat: add Gaussian impulse to a field (velocity or dye)
    const SPLAT_FS = `#version 300 es
precision highp float;
uniform sampler2D u_field;
uniform vec2  u_point;
uniform vec3  u_value;
uniform float u_radius;
uniform float u_aspect;
in  vec2 v_uv;
out vec4 fragColor;
void main() {
    vec2 d = v_uv - u_point;
    d.x *= u_aspect;
    float g = exp(-dot(d, d) / u_radius);
    vec3 prev = texture(u_field, v_uv).rgb;
    fragColor = vec4(prev + u_value * g, 1.0);
}`;

    // Advection: semi-Lagrangian trace-back
    const ADVECT_FS = `#version 300 es
precision highp float;
uniform sampler2D u_velocity;
uniform sampler2D u_source;
uniform vec2  u_texelSize;
uniform float u_dt;
uniform float u_dissipation;
in  vec2 v_uv;
out vec4 fragColor;
void main() {
    vec2 vel = texture(u_velocity, v_uv).xy;
    vec2 coord = v_uv - u_dt * vel * u_texelSize;
    fragColor = u_dissipation * texture(u_source, coord);
}`;

    // Divergence of velocity field
    const DIVERGENCE_FS = `#version 300 es
precision highp float;
uniform sampler2D u_velocity;
uniform vec2  u_texelSize;
in  vec2 v_uv;
out vec4 fragColor;
void main() {
    float L = texture(u_velocity, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture(u_velocity, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float B = texture(u_velocity, v_uv - vec2(0.0, u_texelSize.y)).y;
    float T = texture(u_velocity, v_uv + vec2(0.0, u_texelSize.y)).y;
    float div = 0.5 * (R - L + T - B);
    fragColor = vec4(div, 0.0, 0.0, 1.0);
}`;

    // Jacobi iteration for pressure Poisson equation
    const PRESSURE_FS = `#version 300 es
precision highp float;
uniform sampler2D u_pressure;
uniform sampler2D u_divergence;
uniform vec2  u_texelSize;
in  vec2 v_uv;
out vec4 fragColor;
void main() {
    float L = texture(u_pressure, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture(u_pressure, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float B = texture(u_pressure, v_uv - vec2(0.0, u_texelSize.y)).x;
    float T = texture(u_pressure, v_uv + vec2(0.0, u_texelSize.y)).x;
    float div = texture(u_divergence, v_uv).x;
    float p = (L + R + B + T - div) * 0.25;
    fragColor = vec4(p, 0.0, 0.0, 1.0);
}`;

    // Gradient subtraction: subtract pressure gradient from velocity
    const GRADIENT_FS = `#version 300 es
precision highp float;
uniform sampler2D u_pressure;
uniform sampler2D u_velocity;
uniform vec2  u_texelSize;
in  vec2 v_uv;
out vec4 fragColor;
void main() {
    float L = texture(u_pressure, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture(u_pressure, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float B = texture(u_pressure, v_uv - vec2(0.0, u_texelSize.y)).x;
    float T = texture(u_pressure, v_uv + vec2(0.0, u_texelSize.y)).x;
    vec2 vel = texture(u_velocity, v_uv).xy;
    vel -= 0.5 * vec2(R - L, T - B);
    fragColor = vec4(vel, 0.0, 1.0);
}`;

    // Curl (vorticity) computation
    const CURL_FS = `#version 300 es
precision highp float;
uniform sampler2D u_velocity;
uniform vec2  u_texelSize;
in  vec2 v_uv;
out vec4 fragColor;
void main() {
    float L = texture(u_velocity, v_uv - vec2(u_texelSize.x, 0.0)).y;
    float R = texture(u_velocity, v_uv + vec2(u_texelSize.x, 0.0)).y;
    float B = texture(u_velocity, v_uv - vec2(0.0, u_texelSize.y)).x;
    float T = texture(u_velocity, v_uv + vec2(0.0, u_texelSize.y)).x;
    float curl = R - L - T + B;
    fragColor = vec4(0.5 * curl, 0.0, 0.0, 1.0);
}`;

    // Vorticity confinement force
    const VORTICITY_FS = `#version 300 es
precision highp float;
uniform sampler2D u_velocity;
uniform sampler2D u_curl;
uniform vec2  u_texelSize;
uniform float u_strength;
uniform float u_dt;
in  vec2 v_uv;
out vec4 fragColor;
void main() {
    float cL = texture(u_curl, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float cR = texture(u_curl, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float cB = texture(u_curl, v_uv - vec2(0.0, u_texelSize.y)).x;
    float cT = texture(u_curl, v_uv + vec2(0.0, u_texelSize.y)).x;
    float cC = texture(u_curl, v_uv).x;
    vec2 force = vec2(abs(cT) - abs(cB), abs(cR) - abs(cL));
    float len = length(force) + 1e-5;
    force = force / len * cC * u_strength;
    vec2 vel = texture(u_velocity, v_uv).xy;
    vel += force * u_dt;
    fragColor = vec4(vel, 0.0, 1.0);
}`;

    // Clear shader (fill with a constant value)
    const CLEAR_FS = `#version 300 es
precision highp float;
uniform sampler2D u_field;
uniform float u_value;
in  vec2 v_uv;
out vec4 fragColor;
void main() {
    fragColor = u_value * texture(u_field, v_uv);
}`;

    // Render: dye field → watercolour-style lake surface
    const RENDER_FS = `#version 300 es
precision highp float;
uniform sampler2D u_dye;
uniform sampler2D u_velocity;
uniform vec2  u_texelSize;
in  vec2 v_uv;
out vec4 fragColor;
void main() {
    vec3 dye = texture(u_dye, v_uv).rgb;
    vec2 vel = texture(u_velocity, v_uv).xy;
    float speed = length(vel);

    // Lake palette
    vec3 deep  = vec3(0.420, 0.620, 0.640);
    vec3 mid   = vec3(0.620, 0.820, 0.840);
    vec3 crest = vec3(0.960, 1.000, 0.980);

    // Dye intensity drives colour mapping
    float intensity = length(dye);
    float t = clamp(intensity * 2.0 + speed * 8.0, 0.0, 1.0);
    vec3 col = mix(deep, mid, clamp(t * 1.5, 0.0, 1.0));
    col = mix(col, crest, clamp((t - 0.4) * 2.0, 0.0, 1.0));

    // Surface normal from velocity divergence for subtle shading
    float vL = texture(u_velocity, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float vR = texture(u_velocity, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float vB = texture(u_velocity, v_uv - vec2(0.0, u_texelSize.y)).y;
    float vT = texture(u_velocity, v_uv + vec2(0.0, u_texelSize.y)).y;
    vec3 norm = normalize(vec3(-(vR - vL) * 40.0, -(vT - vB) * 40.0, 1.0));
    vec3 light = normalize(vec3(0.3, 0.55, 1.0));
    float diff = max(dot(norm, light), 0.0);
    vec3 hlf = normalize(light + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(norm, hlf), 0.0), 18.0);
    col = col * (0.82 + 0.18 * diff) + vec3(1.0) * spec * 0.08;

    // Tint with the dye colour at active areas
    col = mix(col, col + dye * 0.15, clamp(intensity * 3.0, 0.0, 0.3));

    fragColor = vec4(col, 1.0);
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
        gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VS));
        gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSrc));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
            console.error('Program link error:', gl.getProgramInfoLog(prog));
        return prog;
    }
    function getUniforms(prog) {
        const uniforms = {};
        const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < count; i++) {
            const info = gl.getActiveUniform(prog, i);
            uniforms[info.name] = gl.getUniformLocation(prog, info.name);
        }
        return uniforms;
    }

    // Build all shader programs and cache their uniforms
    const splatProg      = buildProgram(SPLAT_FS);
    const advectProg     = buildProgram(ADVECT_FS);
    const divergenceProg = buildProgram(DIVERGENCE_FS);
    const pressureProg   = buildProgram(PRESSURE_FS);
    const gradientProg   = buildProgram(GRADIENT_FS);
    const curlProg       = buildProgram(CURL_FS);
    const vorticityProg  = buildProgram(VORTICITY_FS);
    const clearProg      = buildProgram(CLEAR_FS);
    const renderProg     = buildProgram(RENDER_FS);

    const splatU      = getUniforms(splatProg);
    const advectU     = getUniforms(advectProg);
    const divergenceU = getUniforms(divergenceProg);
    const pressureU   = getUniforms(pressureProg);
    const gradientU   = getUniforms(gradientProg);
    const curlU       = getUniforms(curlProg);
    const vorticityU  = getUniforms(vorticityProg);
    const clearU      = getUniforms(clearProg);
    const renderU     = getUniforms(renderProg);

    // Full-screen quad
    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    // VAO for the quad (WebGL2)
    const quadVAO = gl.createVertexArray();
    gl.bindVertexArray(quadVAO);
    gl.enableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    function drawQuad() {
        gl.bindVertexArray(quadVAO);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // ---- Textures & FBOs (double-buffered) ----------------------
    let displayW, displayH, simW, simH;

    function createDoubleFBO(w, h, internalFormat, format, type, filter) {
        const texA = createTex(w, h, internalFormat, format, type, filter);
        const texB = createTex(w, h, internalFormat, format, type, filter);
        return {
            width: w, height: h,
            read:  { tex: texA.tex, fbo: texA.fbo },
            write: { tex: texB.tex, fbo: texB.fbo },
            swap: function () {
                const tmp = this.read;
                this.read = this.write;
                this.write = tmp;
            }
        };
    }
    function createTex(w, h, internalFormat, format, type, filter) {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return { tex, fbo };
    }
    function createSingleFBO(w, h, internalFormat, format, type, filter) {
        return createTex(w, h, internalFormat, format, type, filter);
    }

    let velocity, pressure, dye, divergenceFBO, curlFBO;

    function initBuffers() {
        displayW = canvas.width  = window.innerWidth;
        displayH = canvas.height = window.innerHeight;
        simW = Math.round(displayW * SIM_SCALE);
        simH = Math.round(displayH * SIM_SCALE);

        // Half-float for simulation fields (velocity, pressure, etc.)
        const hf = gl.RGBA16F;
        const rgba = gl.RGBA;
        const hfType = gl.HALF_FLOAT;
        const lin = gl.LINEAR;
        const near = gl.NEAREST;

        velocity     = createDoubleFBO(simW, simH, hf, rgba, hfType, lin);
        pressure     = createDoubleFBO(simW, simH, hf, rgba, hfType, near);
        dye          = createDoubleFBO(displayW, displayH, hf, rgba, hfType, lin);
        divergenceFBO = createSingleFBO(simW, simH, hf, rgba, hfType, near);
        curlFBO       = createSingleFBO(simW, simH, hf, rgba, hfType, near);

        // Clear all buffers
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        [velocity.read, velocity.write, pressure.read, pressure.write,
         dye.read, dye.write, divergenceFBO, curlFBO].forEach(b => {
            gl.bindFramebuffer(gl.FRAMEBUFFER, b.fbo);
            gl.clear(gl.COLOR_BUFFER_BIT);
        });
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    // ---- Simulation steps --------------------------------------
    function splatVelocity(x, y, dx, dy) {
        gl.useProgram(splatProg);
        gl.uniform1i(splatU['u_field'], 0);
        gl.uniform2f(splatU['u_point'], x, y);
        gl.uniform3f(splatU['u_value'], dx, dy, 0.0);
        gl.uniform1f(splatU['u_radius'], SPLAT_RADIUS);
        gl.uniform1f(splatU['u_aspect'], simW / simH);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.viewport(0, 0, simW, simH);
        drawQuad();
        velocity.swap();
    }

    function splatDye(x, y, r, g, b) {
        gl.useProgram(splatProg);
        gl.uniform1i(splatU['u_field'], 0);
        gl.uniform2f(splatU['u_point'], x, y);
        gl.uniform3f(splatU['u_value'], r, g, b);
        gl.uniform1f(splatU['u_radius'], SPLAT_RADIUS * 1.5);
        gl.uniform1f(splatU['u_aspect'], displayW / displayH);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, dye.read.tex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, dye.write.fbo);
        gl.viewport(0, 0, displayW, displayH);
        drawQuad();
        dye.swap();
    }

    function advectField(source, target, dt, dissipation) {
        gl.useProgram(advectProg);
        gl.uniform1i(advectU['u_velocity'], 0);
        gl.uniform1i(advectU['u_source'], 1);
        gl.uniform2f(advectU['u_texelSize'], 1.0 / simW, 1.0 / simH);
        gl.uniform1f(advectU['u_dt'], dt);
        gl.uniform1f(advectU['u_dissipation'], dissipation);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, source.read.tex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.write.fbo);
        gl.viewport(0, 0, target.width, target.height);
        drawQuad();
        target.swap();
    }

    function computeDivergence() {
        gl.useProgram(divergenceProg);
        gl.uniform1i(divergenceU['u_velocity'], 0);
        gl.uniform2f(divergenceU['u_texelSize'], 1.0 / simW, 1.0 / simH);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, divergenceFBO.fbo);
        gl.viewport(0, 0, simW, simH);
        drawQuad();
    }

    function solvePressure() {
        gl.useProgram(pressureProg);
        gl.uniform1i(pressureU['u_divergence'], 1);
        gl.uniform2f(pressureU['u_texelSize'], 1.0 / simW, 1.0 / simH);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, divergenceFBO.tex);

        // Clear pressure before iterating (important for accuracy)
        gl.useProgram(clearProg);
        gl.uniform1i(clearU['u_field'], 0);
        gl.uniform1f(clearU['u_value'], 0.8);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
        gl.viewport(0, 0, simW, simH);
        drawQuad();
        pressure.swap();

        gl.useProgram(pressureProg);
        gl.uniform1i(pressureU['u_pressure'], 0);
        gl.uniform1i(pressureU['u_divergence'], 1);
        gl.uniform2f(pressureU['u_texelSize'], 1.0 / simW, 1.0 / simH);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, divergenceFBO.tex);

        for (let i = 0; i < JACOBI_ITERS; i++) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
            gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
            gl.viewport(0, 0, simW, simH);
            drawQuad();
            pressure.swap();
        }
    }

    function subtractGradient() {
        gl.useProgram(gradientProg);
        gl.uniform1i(gradientU['u_pressure'], 0);
        gl.uniform1i(gradientU['u_velocity'], 1);
        gl.uniform2f(gradientU['u_texelSize'], 1.0 / simW, 1.0 / simH);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.viewport(0, 0, simW, simH);
        drawQuad();
        velocity.swap();
    }

    function computeCurl() {
        gl.useProgram(curlProg);
        gl.uniform1i(curlU['u_velocity'], 0);
        gl.uniform2f(curlU['u_texelSize'], 1.0 / simW, 1.0 / simH);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, curlFBO.fbo);
        gl.viewport(0, 0, simW, simH);
        drawQuad();
    }

    function applyVorticity(dt) {
        gl.useProgram(vorticityProg);
        gl.uniform1i(vorticityU['u_velocity'], 0);
        gl.uniform1i(vorticityU['u_curl'], 1);
        gl.uniform2f(vorticityU['u_texelSize'], 1.0 / simW, 1.0 / simH);
        gl.uniform1f(vorticityU['u_strength'], VORTICITY_STRENGTH);
        gl.uniform1f(vorticityU['u_dt'], dt);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, curlFBO.tex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
        gl.viewport(0, 0, simW, simH);
        drawQuad();
        velocity.swap();
    }

    function renderToScreen() {
        gl.useProgram(renderProg);
        gl.uniform1i(renderU['u_dye'], 0);
        gl.uniform1i(renderU['u_velocity'], 1);
        gl.uniform2f(renderU['u_texelSize'], 1.0 / displayW, 1.0 / displayH);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, dye.read.tex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, displayW, displayH);
        drawQuad();
    }

    // ---- Splat queue -------------------------------------------
    let pendingSplats = [];

    function queueSplat(px, py, vx, vy, color) {
        const x = px / displayW;
        const y = 1.0 - py / displayH;
        pendingSplats.push({ x, y, dx: vx, dy: -vy, color });
    }

    function processSplats() {
        for (let i = 0; i < pendingSplats.length; i++) {
            const s = pendingSplats[i];
            splatVelocity(s.x, s.y, s.dx, s.dy);
            splatDye(s.x, s.y, s.color[0], s.color[1], s.color[2]);
        }
        pendingSplats = [];
    }

    // ---- Water colour palette for splats -----------------------
    const WATER_COLORS = [
        [0.15, 0.35, 0.40],
        [0.20, 0.45, 0.50],
        [0.10, 0.30, 0.35],
        [0.25, 0.50, 0.55],
        [0.18, 0.40, 0.45],
        [0.12, 0.32, 0.38],
    ];
    function randomWaterColor() {
        return WATER_COLORS[Math.floor(Math.random() * WATER_COLORS.length)];
    }

    // ---- Main loop ---------------------------------------------
    let lastTime = null;

    function loop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min((timestamp - lastTime) / 1000, 0.033);
        lastTime = timestamp;

        // Inject mouse splats
        if (mouseX >= 0) {
            const dist = Math.hypot(mouseX - lastDropX, mouseY - lastDropY);
            if (dist > 3 || lastDropX < 0) {
                if (lastDropX >= 0 && dist > 0) {
                    const vel = getRecentPointerVelocity();
                    const speed = vel.speed;
                    const force = Math.min(speed * 0.15, 300.0);
                    const ndx = speed > 0 ? vel.vx / speed * force : 0;
                    const ndy = speed > 0 ? vel.vy / speed * force : 0;
                    const STEP_PX = 8;
                    const steps = Math.max(1, Math.round(dist / STEP_PX));
                    for (let s = 1; s <= steps; s++) {
                        const t = s / steps;
                        const ix = lastDropX + (mouseX - lastDropX) * t;
                        const iy = lastDropY + (mouseY - lastDropY) * t;
                        queueSplat(ix, iy, ndx, ndy, splatColor);
                    }
                } else {
                    splatColor = randomWaterColor();
                    queueSplat(mouseX, mouseY, 0, 0, splatColor);
                }
                lastDropX = mouseX;
                lastDropY = mouseY;
            }
        }

        processSplats();

        // Navier-Stokes simulation pipeline
        computeCurl();
        applyVorticity(dt);
        advectField(velocity, velocity, dt, VELOCITY_DISSIPATION);
        advectField(dye, dye, dt, DYE_DISSIPATION);
        computeDivergence();
        solvePressure();
        subtractGradient();

        renderToScreen();
        requestAnimationFrame(loop);
    }

    // ---- Input -------------------------------------------------
    let mouseX = -1, mouseY = -1;
    let lastDropX = -1, lastDropY = -1;
    let splatColor = randomWaterColor();
    const pointerHistory = [];
    const POINTER_HISTORY_MS = 120;
    const MAX_POINTER_POINTS = 8;

    function prunePointerHistory(now) {
        while (pointerHistory.length > MAX_POINTER_POINTS) pointerHistory.shift();
        while (pointerHistory.length > 1 && now - pointerHistory[0].t > POINTER_HISTORY_MS) {
            pointerHistory.shift();
        }
    }

    function recordPointerPoint(px, py) {
        const now = performance.now();
        mouseX = px;
        mouseY = py;
        pointerHistory.push({ x: px, y: py, t: now });
        prunePointerHistory(now);
    }

    function clearPointerHistory() {
        pointerHistory.length = 0;
    }

    function getRecentPointerVelocity() {
        if (pointerHistory.length < 2) {
            return { vx: 0, vy: 0, speed: 0 };
        }

        const latest = pointerHistory[pointerHistory.length - 1];
        let earliest = pointerHistory[0];

        for (let i = pointerHistory.length - 2; i >= 0; i--) {
            const point = pointerHistory[i];
            if ((latest.t - point.t) >= 16) {
                earliest = point;
                break;
            }
        }

        const dt = Math.max((latest.t - earliest.t) / 1000, 0.001);
        let vx = (latest.x - earliest.x) / dt;
        let vy = (latest.y - earliest.y) / dt;
        let speed = Math.hypot(vx, vy);

        const MAX_POINTER_SPEED = 2000;
        if (speed > MAX_POINTER_SPEED) {
            const scale = MAX_POINTER_SPEED / speed;
            vx *= scale;
            vy *= scale;
            speed = MAX_POINTER_SPEED;
        }

        return { vx, vy, speed };
    }

    function onMove(px, py) {
        recordPointerPoint(px, py);
    }

    function onBurst(px, py) {
        const color = randomWaterColor();
        // Radial burst: inject velocity in multiple directions for a splash
        const burstForce = 180;
        const dirs = 8;
        for (let i = 0; i < dirs; i++) {
            const angle = (i / dirs) * Math.PI * 2;
            const dx = Math.cos(angle) * burstForce;
            const dy = Math.sin(angle) * burstForce;
            queueSplat(px, py, dx, dy, color);
        }
    }

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
        mouseX = -1; mouseY = -1; lastDropX = -1; lastDropY = -1;
        clearPointerHistory(); initBuffers();
    });
    window.addEventListener('pointerleave', () => {
        mouseX = -1; mouseY = -1; lastDropX = -1; lastDropY = -1;
        clearPointerHistory();
        splatColor = randomWaterColor();
    });
    window.addEventListener('pointercancel', () => {
        mouseX = -1; mouseY = -1; lastDropX = -1; lastDropY = -1;
        clearPointerHistory();
    });
    window.addEventListener('touchend', () => {
        mouseX = -1; mouseY = -1; lastDropX = -1; lastDropY = -1;
        clearPointerHistory();
        splatColor = randomWaterColor();
    }, { passive: true });

    // Ambient drips – gentle random impulses
    setInterval(() => {
        const ax = Math.random() * displayW;
        const ay = Math.random() * displayH;
        const angle = Math.random() * Math.PI * 2;
        const force = 30 + Math.random() * 60;
        const color = randomWaterColor();
        queueSplat(ax, ay, Math.cos(angle) * force, Math.sin(angle) * force, color);
    }, 1800);

    initBuffers();
    requestAnimationFrame(loop);
}());
