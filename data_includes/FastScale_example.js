
var shuffleSequence = seq(sepWith("sep", "item"),"outro");

var completionMessage = "Thank you for your participation!"

var defaults = [
    "Separator", {
        transfer: 1000,
        normalMessage: "Please wait for the next sentence.",
        errorMessage: "Wrong. Please wait for the next sentence.",
        ignoreFailure: true,
        hideProgressBar: true
    },
    "Message", {
       hideProgressBar: true
    },
    "FastScale", {
        startValue: 0,  
        endValue: 100,
        hideProgressBar: true,
        handleLabel: false,
        scaleLabels: ["Odd","Natural"],
        startColor: "#A00000",
        endColor: "#0050A0"
    }
];



var items = [

    ["sep", "Separator", {transfer:300, normalMessage:"+"}],

  ["outro", "Message", {html:{include:"outro.html"}}],
    
// items

    
  ["item", "FastScale", {html: "Rate this sentence!"}],
  ["item", "FastScale", {html: "Rate this sentence on a numerical scale!",scaleLabels:"numeric",handleLabel:true}],
  ["item", "FastScale", {html: "Rate this sentence on a scale with no labels!",scaleLabels:null}],
  ["item", "FastScale", {html: "<img src='https://upload.wikimedia.org/wikipedia/commons/3/34/Longest_dinosaurs2.svg' width=800px> <p>The red dinosaur is big for a giant sauropod.</p>", scaleLabels:["disagree","agree"]}],
  ["item", "FastScale", {html: "<img src='https://upload.wikimedia.org/wikipedia/commons/3/34/Longest_dinosaurs2.svg' width=800px> <p>The purple dinosaur is big for a giant sauropod.</p>", scaleLabels:["disagree","agree"]}],
  ["item", "FastScale", {html: "<img src='https://upload.wikimedia.org/wikipedia/commons/3/34/Longest_dinosaurs2.svg' width=800px> <p>The green dinosaur is big for a giant sauropod.</p>", scaleLabels:["disagree","agree"]}],
    
 
    ];

