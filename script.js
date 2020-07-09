

//painting slider

const sliderContainer = document.querySelector(".gallery-slider"); //find gallery-slider from index.html
const slides = sliderContainer.children;
const containerWidth = sliderContainer.offsetWidth; //width of the gallery-slider div
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

    start(); //go to start function
}

function start(){

    totalWidth=0;

    //set width of each image
    for(let i=0; i<slides.length; i++){
        slides[i].style.width = (containerWidth/itemPerSlide)-margin + "px"; // add width (width of the entire image display place / the number of image can be displayed )
        slides[i].style.margin = margin/2 + "px"; //  set margin to all four values of the margin
           
        
        

        totalWidth += containerWidth/itemPerSlide;

        console.log("itemPerSlide" + itemPerSlide);
        console.log("containerWidth" +containerWidth);
        console.log("totalWidth" +totalWidth);
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

 	sliderContainer.style.marginLeft=-(containerWidth*currentSlide) + "px"; //set the style, the transition property will then trans to the proper position
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






let timer=setInterval(autoPlay,5000);

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



