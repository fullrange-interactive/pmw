
var groupId = "55e892fd5a504b8fc0f2917a";
var slides = [
    "56fd5f035308df5f2400000b",
    "56fd5ec85308df5f24000007",
    "56fd60565308df5f24000010"
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var changeSlide = function()
{
    var slideId = slides[getRandomInt(0,slides.length)];
    
    console.log("Changing to "+slideId);
    sendSlideToWindow("0","0",slideId,groupId,"crossfade");
}

var sceduleNextSlide = function(){
    
    window.setTimeout(function(){
        changeSlide();
        sceduleNextSlide();

    },Math.random()*30000);

}

sceduleNextSlide();
