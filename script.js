

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

const margin=30;

let itemPerSlide=0; //how many images it can display in one slide
let slideDots;
  
// responsive
const responsive=[ //save an dictionary for how many image to display on one slide
        //min width to display more item 
        {breakPoint:{width:0,item:1}},
        {breakPoint:{width:991,item:2}} ,
        {breakPoint:{width:1300,item:3}}
     ]        

async function load(){

    
    for(let i=0; i<responsive.length; i++){

        //loop through all min width to find the best itemPerSlide value
    	if(window.innerWidth>responsive[i].breakPoint.width){ //innerWidth is the width of the webpage (px)
            
            itemPerSlide=responsive[i].breakPoint.item;  

    	}

    }
    await generateGallery();
    start(); //go to start function

}

function start(){

    totalWidth=0;

    //set width of each image
    for(let i=0; i<slides.length; i++){
        slides[i].style.width = (paintingGalleryWidth/itemPerSlide)-margin + "px"; // add width (width of the entire image display place / the number of image can be displayed )
        slides[i].style.margin = margin/2 + "px"; //  set margin to all four values of the margin
           
        

        totalWidth += paintingGalleryWidth/itemPerSlide;

    }

    sliderContainer.style.width=totalWidth + "px"; //set the width of the displace div 


    slideDots=Math.ceil(slides.length/itemPerSlide); //calculate how many dots need to display at the bottom

    //slide dot creation process
    for(let i=0; i<slideDots; i++){

        const div=document.createElement("div");//create a new div object
          
      	div.id=i;
      	div.setAttribute("onclick","controlSlide(this)"); //set a function when clicked
      	if(i==0){
        	div.classList.add("active");
        }

      	document.querySelector(".slide-controls").appendChild(div);//add it to the slide controls div
      }
 }
 
 //auto slide the display image page
let currentSlide=0;
let    autoSlide=0;
         
function controlSlide(element){
	clearInterval(timer) //The clearInterval() method clears a timer set with the setInterval() method.
 	timer=setInterval(autoPlay,5000);
    autoSlide=element.id;
    currentSlide=element.id;
    changeSlide(currentSlide)
}

function changeSlide(currentSlide){
 	controlButtons=document.querySelector(".slide-controls").children;

    for(let i=0; i<controlButtons.length; i++){
 	 	controlButtons[i].classList.remove("active") //The classList property returns the class name(s) of an element, as a DOMTokenList object. This property is useful to add, remove and toggle CSS classes on an element.
      }
      
 	controlButtons[currentSlide].classList.add("active")

 	sliderContainer.style.marginLeft=-(paintingGalleryWidth*currentSlide) + "px"; //set the style, the transition property will then trans to the proper position
}

//autp play the slide
function autoPlay(){
        
    if(autoSlide==slideDots-1){
        autoSlide=0;
    }
    else{
        autoSlide++;
    }

    changeSlide(autoSlide) //input the id of the slide
}


async function generateGallery(){

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



let timer=setInterval(autoPlay,2000);

window.onload = load;

 // header fixed

 window.onscroll=function(){

    const docScrollTop=document.documentElement.scrollTop;

    if(window.innerWidth>991){
        if(docScrollTop>100){
            document.querySelector("header").classList.add("fixed")
        }
        else{
        document.querySelector("header").classList.remove("fixed")	
        }
    }
}    

// ---- Cat Pet ----
(function () {
    const pet     = document.getElementById('pet');
    const inner   = pet.querySelector('.pet-inner');

    const CAT_W   = 70;
    const CAT_H   = 88;

    // starting position: near centre of viewport
    let catX = window.innerWidth  / 2 - CAT_W / 2;
    let catY = window.innerHeight / 2 - CAT_H / 2;
    let vx   = 0;
    let vy   = 0;

    let mouseX       = catX + CAT_W / 2;
    let mouseY       = catY + CAT_H / 2;
    let lastMoveTime = 0;

    let wanderAngle = Math.random() * Math.PI * 2;
    let wanderTimer = 0;
    let lastFlip    = 1;   // 1 = face right, -1 = face left
    let lastTime    = null;

    window.addEventListener('mousemove', function (e) {
        mouseX       = e.clientX;
        mouseY       = e.clientY;
        lastMoveTime = Date.now();
    });

    function loop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt  = Math.min((timestamp - lastTime) / 1000, 0.05); // seconds, capped
        lastTime  = timestamp;

        const now       = Date.now();
        const isChasing = (now - lastMoveTime) < 1500;
        const maxX      = window.innerWidth  - CAT_W;
        const maxY      = window.innerHeight - CAT_H;

        if (isChasing) {
            // ---- Chase mode ----
            const dx   = mouseX - (catX + CAT_W / 2);
            const dy   = mouseY - (catY + CAT_H / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 8) {
                const speed = 260;
                vx += (dx / dist * speed - vx) * 9 * dt;
                vy += (dy / dist * speed - vy) * 9 * dt;
            } else {
                vx *= 0.75;
                vy *= 0.75;
            }
        } else {
            // ---- Wander mode ----
            wanderTimer -= dt;
            if (wanderTimer <= 0) {
                wanderAngle = Math.random() * Math.PI * 2;
                wanderTimer = 1.8 + Math.random() * 2.2;
            }
            const wSpeed = 55;
            vx += (Math.cos(wanderAngle) * wSpeed - vx) * 2.5 * dt;
            vy += (Math.sin(wanderAngle) * wSpeed - vy) * 2.5 * dt;
        }

        catX += vx * dt;
        catY += vy * dt;

        // Bounce off viewport edges
        if (catX < 0)    { catX = 0;    vx =  Math.abs(vx); wanderAngle = Math.atan2(vy,  Math.abs(vx)); }
        if (catX > maxX) { catX = maxX; vx = -Math.abs(vx); wanderAngle = Math.atan2(vy, -Math.abs(vx)); }
        if (catY < 0)    { catY = 0;    vy =  Math.abs(vy); wanderAngle = Math.atan2( Math.abs(vy), vx); }
        if (catY > maxY) { catY = maxY; vy = -Math.abs(vy); wanderAngle = Math.atan2(-Math.abs(vy), vx); }

        // Apply position
        pet.style.left = catX + 'px';
        pet.style.top  = catY + 'px';

        // Flip to face direction of travel
        if      (vx >  3) lastFlip =  1;
        else if (vx < -3) lastFlip = -1;
        pet.style.transform = 'scaleX(' + lastFlip + ')';

        // Walk bob animation
        const spd = Math.sqrt(vx * vx + vy * vy);
        if (spd > 12) {
            inner.classList.add('walking');
        } else {
            inner.classList.remove('walking');
        }

        requestAnimationFrame(loop);
    }

    // Kick off after page load so the cat starts at a sensible spot
    window.addEventListener('load', function () {
        catX = window.innerWidth  / 2 - CAT_W / 2;
        catY = window.innerHeight / 2 - CAT_H / 2;
        pet.style.left = catX + 'px';
        pet.style.top  = catY + 'px';
        requestAnimationFrame(loop);
    });
})();




