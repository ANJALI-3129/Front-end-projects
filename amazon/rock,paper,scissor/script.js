let userScore=0;
let compScore=0;
const choices=document.querySelectorAll(".choice");
const msg=document.querySelector("#msg");
const userScorepara =document.querySelector("#user-score");
const compScorepara=document.querySelector("#comp-score")
const genCompChoice=()=>{
    const options=["rock","paper","scissors"];
   const randIdx= Math.floor(Math.random()*3);
   return options[randIdx];
};
const Draw=()=>{
    console.log("Game was draw");
    msg.innerText="Game draw Play again.";
    msg.style.backgroundColor="#564787";
};
const showWinner=(userWin ,userChoice,CompChoice)=>{
   if(userWin){
userScore++;
userScorepara.innerText=userScore;
    console.log("you win!");
    msg.innerText=`you win! ${userChoice} beats ${CompChoice}`;
    msg.style.backgroundColor="#57A4B2";
}else{
    compScore++;
    compScorepara.innerText=compScore;
    console.log("you lose");
    msg.innerText=`you lose, ${CompChoice} beats ${userChoice}`;
  msg.style.backgroundColor="#A94C4F";
}
};
const PlayGame=(userChoice)=>{
    console.log("user choice=",userChoice);
    //generate computer choice
    const CompChoice=genCompChoice();
    console.log("comp choice=",CompChoice);
    if(userChoice===CompChoice){
        //Draw Game
        Draw();
    }else{
       
        let userWin =true;
        if(userChoice==="rock"){
            //paper,scissors
            userWin=CompChoice==="paper"?false:true;
        }else if(userChoice==="paper"){
            //rock,scissors
            userWin=CompChoice==="scissors"?false:true;
        }else{
            //rock,paper
            userWin=CompChoice==="rock"?false:true;
        }
showWinner(userWin ,userChoice, CompChoice);
    }
};
choices.forEach((choice)=>{
    choice.addEventListener("click",()=>{
        const userChoice=choice.getAttribute("id");
       PlayGame(userChoice);
    });
});
