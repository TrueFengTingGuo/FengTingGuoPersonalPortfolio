

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

function load(){

    
    for(let i=0; i<responsive.length; i++){

        //loop through all min width to find the best itemPerSlide value
    	if(window.innerWidth>responsive[i].breakPoint.width){ //innerWidth is the width of the webpage (px)
            
            itemPerSlide=responsive[i].breakPoint.item;  

    	}

    }
    generateGallery();
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


function generateGallery(){

    // Array of image filenames
	const imageFiles = ["girl3","purple1","flower1","dog1","horse1", "girl2","car2",
    "Flower and girl", "Fruit", "Bird", "Chris Hemsworth",
    "Deer", "Elden Ring", "Girl Portarit 2", "Girl Portrait" ,"Man In Car","Red Car",
    "red lady", "simple women"];


	// Get a reference to the gallery container
	const gallery = document.querySelector('.gallery-slider');

     	// String template for each item
	const itemTemplate = 
    '<div class="item"> ' +
        '<img src="Images/{directory}.jpg" alt="painting">' +
        ' <div class="overlay">'+
               '<h1>Refence found from internet</h1>' + 
         '</div>'+
    ' </div>';

	// Loop through the array of image filenames and create an <img> tag for each one
    let html = '';
	for (let i = 0; i < imageFiles.length; i++) {   
         const itemHtml = itemTemplate.replace('{directory}', imageFiles[i]);
		html += itemHtml;
	}
    gallery.innerHTML += html;
}



let timer=setInterval(autoPlay,2000);

window.onload = load();

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



