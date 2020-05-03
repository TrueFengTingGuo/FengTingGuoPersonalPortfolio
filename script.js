

window.onscroll = function()
{
    const scrollTop = this.document.documentElement.scrollTop;

    if(scrollTop > 100){
        this.document.querySelector("header").classList.add("fixed");

    }
    else{
        this.document.querySelector("header").classList.remove("fixed");
    }
}




const navbar = document.querySelector(".navbar");

a = navbar.querySelectorAll("a");

a.forEach(function(element){
    element.add("click",function(){

        for(Let !=0; 1 < a.length; i++){
            a[i].classList.remove("active")
        }
        this.classList.add("active")

    })

})