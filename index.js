//declartion of variables
const startBtn = document.querySelector('#start1');
const head = document.querySelector('h1');
const continueBtn = document.querySelector("#hidden");
const gridContainer = document.querySelector('.grid-container');
const gridItems = Array.from(document.querySelectorAll('.grid-item'));
const maxScore = document.querySelector('#Maxscore');
const score = document.querySelector('#score');
const timerValueElement = document.getElementById('timerValue');
const timer = document.getElementById('#timer');
const buttons = document.querySelectorAll('.level-buttons button');
const toogleBtn = document.querySelector('#light-mode');
let lightMode = false;
let Max = 0;
let gameScore = 0;
let continueGame = false;
let isBlinking = true;
const levels = {
    easy: { size: 3, animationSpeed: 1000 }, // Easy level
    medium: { size: 4, animationSpeed: 800 },  // Medium level
    hard: { size: 5, animationSpeed: 600 }     // Hard level
};
let currentLevel = levels.easy; // Default to easy level
// Update the current level based on the player's choice
function setLevel(level) {
    currentLevel = levels[level];
}
//adding blinking effect to the text
head.classList.add('blinking-text');
//event listener to change the mode
toogleBtn.addEventListener('click',()=>{
    lightMode=!lightMode;
    if(lightMode){
        document.body.classList.add('light-mode');
        head.style.color = "black";
        toogleBtn.innerHTML = '&#x263D;' + ' MODE';
    }
    else{
        document.body.classList.remove('light-mode');
        head.style.color = "white";
        toogleBtn.innerHTML = '&#x263C' + ' MODE';
    }
});
// Function to display the modal
function displayGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'block';
    const gameOverSound = document.querySelector('#gameOverSound');
    gameOverSound.play();
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'none';
}
//Function for Button to keep dark color until it is clicked
function ButtonClick(button){
    buttons.forEach(btn=>{
        btn.classList.remove('active');
    });
    button.classList.add('active');
}

buttons.forEach(button=>{
    button.addEventListener('click',()=>{
        const soundBtn = document.querySelector('#click-btn');
        soundBtn.play();
        ButtonClick(button);
    });
});
//eventlistener for start and continue button
startBtn.addEventListener('click',function(){
    head.classList.remove('blinking-text');
    const soundBtn = document.querySelector('#click-btn');
    soundBtn.play();
    startGame();
});
continueBtn.addEventListener('click',function(){
    head.classList.remove('blinking-text');
    if(continueGame){
        const soundBtn = document.querySelector('#click-btn');
        soundBtn.play();
        startGame();
    }
});
//main logic 
function startGame(){
    continueBtn.style.display = "block";
    startBtn.style.display = "none";
    continueBtn.style.position = "relative";
    continueBtn.style.left = "50%";
    continueBtn.style.transform = "translateX(-50%)";

    const level = currentLevel.size; // Get the grid size based on the current level
    
    const animationSpeed = currentLevel.animationSpeed; // Get the animation speed based on the current level
    const randIndices = [];
    const selectedIndices =[]; //this stores the grids clicked by the user
    /*This generates random grids*/


    while(randIndices.length < level){
        const randIndex = Math.floor(Math.random()*gridItems.length);
        randIndices.push(randIndex);    
    }

    /*Used to run animation of change in background color*/
    randIndices.forEach((selectedIndex,animationIndex) => {
        setTimeout(()=>{
                let selectedGridItem = gridItems[selectedIndex];
                selectedGridItem.style.backgroundColor = "white";
                setTimeout(()=>{
                    selectedGridItem = gridItems[selectedIndex];
                    selectedGridItem.style.backgroundColor = "";//Reset to default  
                    
                },500);
        },animationIndex*animationSpeed);//u can set some n if level increase then divide delay by 2
    });
    /*Storing user input*/
    const totalAnimationDuration = randIndices.length * 1000; // Total duration of all animations
    const delayAfterAnimations = 6000; // Delay in milliseconds after animations
    setTimeout(()=>{
        startTimer((totalAnimationDuration+delayAfterAnimations)/1000);
        gridItems.forEach((gridItem, index) => {
            gridItem.addEventListener('click', function() {
                selectedIndices.push(index);
                gridItem.style.backgroundColor = "white"; // You can add a visual indication that the user clicked it
                const clickSound = document.getElementById('clickSound');
                clickSound.currentTime = 0;
                clickSound.play();
                setTimeout(()=>{
                    gridItem.style.backgroundColor = "";
                },500)
                    // You can add a visual indication that the user clicked it
            });
        });
    });

    setTimeout(function(){
        if(arraysAreEqual(randIndices,selectedIndices)){
            gameScore += level;
            score.innerHTML = '&#x261B' + " Score - "+`${gameScore}`;
            if(gameScore>Max){
                Max = gameScore;
                maxScore.innerHTML = "&#127942" +"MaxScore - " + `${Max}` +" "+ "&#8593";
            }
            head.innerHTML = "Click continue to move to next set";
            head.classList.add('blinking-text');
            head.style.color = "#fb8500";
            continueGame = true;
        }
        else{
            displayGameOverModal();
            resetGame();
        }
    },(delayAfterAnimations+totalAnimationDuration));
}


//Function to start the Timer Clock 

function startTimer(timerValue) {
    const timerInterval = setInterval(() => {
        timerValue--;
        if (timerValue < 5) {
            timerValueElement.classList.add('red-timer');
        } else {
            timerValueElement.classList.remove('red-timer');
        }
        timerValueElement.textContent = timerValue;
        
        if (timerValue === 0) {
            clearInterval(timerInterval);
            timerValueElement.classList.remove('red-timer');
        }
    },1000);
}


//Function to Reset The Game
const resetGame = () => {
    //Reseting Level to easy
    head.classList.add('blinking-text');
    currentLevel = levels.easy
    buttons.forEach(button=>{
        button.classList.remove('active');
    });
    // Reset button visibility and text
    continueBtn.style.display = "none";
    startBtn.style.display = "block";
    startBtn.style.position = "relative";
    startBtn.style.left = "50%";
    startBtn.style.transform = "translateX(-50%)";
    continueGame = false;
     
    // Reset header text and color
    head.innerHTML = "Click on Start For New Game";
    if(lightMode){
        head.style.color = "Black";
    }
    else{
        head.style.color = "white";
    }
    //reseting gameScore to 0
    gameScore = 0;
    score.innerHTML = "Score-00";
    maxScore.innerHTML = "&#127942" +"MaxScore - " + `${Max}`;

    // Reset grid item background colors
    gridItems.forEach(gridItem=>{
        gridItem.style.backgroundColor = "rgba(99, 98, 98, 0.8)";
    })
        

    // Remove event listeners
    gridItems.forEach((gridItem) => {
        gridItem.removeEventListener('click', null);
    });
};
function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}