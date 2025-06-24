import "./sadoku.css";
import React from "react";
import { useState, useEffect } from "react";
import * as setBoard from "./boardSetUp/setBoard";

const Sadoku = ()=>{
    const [array, setArray] = useState([]);
    const [cellFocus, setCellFocus] = useState([]);
    const [theme, setTheme] = useState("default");
    const [finishStatus, setFinishStatus] = useState(false);

    function colours(){
        if(theme==="light"||theme==="default"){
            return{
                backgroundColour:"rgba(255,255,255,0.5)",
                fade: false,
                textColour:"black",
                highlightColour: "#D1E9F6",
                textAccentColour:"blue",
                keyColour: "linear-gradient(#a7a7a7, #dadada)",
                keyTextColour: "#4c4c4c"
            }
        }else{
            return {
                backgroundColour:"rgba(31,31,31,0.7)",
                fade: true,
                textColour:"white",
                highlightColour: "#0B192C",
                textAccentColour:"#9D54D4",
                keyColour: "linear-gradient(#1E1F1F,#4C4E4E)",
                keyTextColour: "white"
            }
        }
    }

    const leftBorder = {
        borderLeftColor: colours().textColour
    }
    const rightBorder = {
        borderRightColor: colours().textColour
    }
    const topBorder = {
        borderTopColor: colours().textColour
    }
    const bottomBorder = {
        borderBottomColor: colours().textColour
    }


    function handleKeyClick(val){
        if(cellFocus.length===0) return;
        let cell = document.getElementById(`${cellFocus[0]},${cellFocus[1]}`);
        if(cell.className==="cell") return;
        else{
            
            let modeColours = colours();
            let element = document.getElementById(`${cellFocus}`)
            element.innerHTML = val;
            let isWrong = true;
            let origin = setBoard.cellToOrigin(cellFocus);
            let freeNumbers = setBoard.freeNumbers(origin, cellFocus);
            for(let i = 0; i<freeNumbers.length; i++){
                if(val===freeNumbers[i]){
                    isWrong = false;
                    element.style.color = modeColours.textAccentColour;
                    let emptyCells = document.getElementsByClassName("editCell");
                    for(let i = 0; i<emptyCells.length; i++){
                        if(emptyCells[i].style.color==="red"||emptyCells[i].innerHTML==="") return;
                    }
                    setFinishStatus(true);
                    return
                }
            }
            if(isWrong) element.style.color = "red"
        }

    }

    function fade_out(element){
        let op = 1;  // initial opacity
        let timer = setInterval(()=> {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 20);
    }

    function fade_in(element){
        let op = 0.1;  // initial opacity
        element.style.display = 'block';
        let timer = setInterval(()=>{
            if (op >= 1){
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 20);
    }

    function reloadPage(){
        window.location.reload()
    }

    

    useEffect(()=>{
        //set up array
        setArray(setBoard.setBoard());
    },[]);

    useEffect(()=>{
        if(finishStatus==false) return;
        let banner = document.getElementById("finishedBanner");
        let message = document.getElementById("message");
        if(theme==="dark"){
            banner.style.background = 'rgb(0,0,0,0.5)'
            message.style.color = "white";
        } 
        banner.style.opacity = 0.1;
        banner.style.filter = "alpha(opacity=0.1)";
        message.style.opacity = 0.1;
        message.style.filter = "alpha(opacity=0.1)";
        fade_in(banner);
        fade_in(message);
    },[finishStatus])

    useEffect(()=>{
        //highlight cells on cellfocus
        if(cellFocus.length===0) return
        let modeColours = colours();
        let origin = setBoard.cellToOrigin(cellFocus);
        let cells = document.getElementsByClassName("cell");
        let cells2 = document.getElementsByClassName("editCell");
        for(let i = 0; i<cells.length; i++){
            cells[i].style.backgroundColor = modeColours.backgroundColour;
        }
        for(let i = 0; i<cells2.length; i++){
            cells2[i].style.backgroundColor = modeColours.backgroundColour;
        }
        for(let i = 0; i<3; i++){
            document.getElementById(`${origin[0]},${origin[1]+i}`).style.backgroundColor = modeColours.highlightColour;
            document.getElementById(`${origin[0]+1},${origin[1]+i}`).style.backgroundColor = modeColours.highlightColour;
            document.getElementById(`${origin[0]+2},${origin[1]+i}`).style.backgroundColor = modeColours.highlightColour;
        }
        for(let i = 0; i<9; i++){
            document.getElementById(`${cellFocus[0]},${i}`).style.backgroundColor = modeColours.highlightColour;
            document.getElementById(`${i},${cellFocus[1]}`).style.backgroundColor = modeColours.highlightColour;
        }
    },[cellFocus])

    

    useEffect(()=>{
        //change theme
        if(theme==="default") return;
        let modeColours = colours();
        let element = document.getElementById("daytime");
        document.getElementById("switchLabel").style.color = modeColours.textColour
        let cells = document.getElementsByClassName("cell");
        let cells2 = document.getElementsByClassName("editCell");
        let key;
        for(let i = 1; i< 10; i++){
            key = document.getElementById(i);
            key.style.backgroundImage = modeColours.keyColour;
            key.style.color = modeColours.keyTextColour;
        }
        for(let i = 0; i<cells.length; i++){
            cells[i].style.backgroundColor = modeColours.backgroundColour;
            cells[i].style.color = modeColours.textColour;
        }
        for(let i = 0; i<cells2.length; i++){
            cells2[i].style.backgroundColor = modeColours.backgroundColour;
            if(cells2[i].style.color!=="red") cells2[i].style.color = modeColours.textAccentColour;
        }
        for(let i = 1; i<10; i++){
            document.getElementById(i).style.borderColor = modeColours.backgroundColour;
        }
        if(modeColours.fade) {
            fade_out(element)
        }else{
            fade_in(element)
        }
    },[theme])
    
    

    const values = [[1,2,3],[4,5,6],[7,8,9]];

    return(
        <>
        <div id="daytime"></div>
        <div class="form-check form-switch" id="modeSwitch">
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={()=>theme==="dark"?setTheme("light"):setTheme("dark")}></input>
            <label class="form-check-label" for="flexSwitchCheckDefault" id="switchLabel">Change to {theme==="light"||theme==="default"?"dark mode":"light mode"}</label>
        </div>
        <div class="keyPad" id = "keyPad">
            {values.map((row, index)=>(
                <div class="row g-0">
                    {row.map((val)=>(
                        <div class="col">
                            <div class="key" id={val} onClick={()=>handleKeyClick(val)}>{val}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
        
        <div class="parent" id="parent" style={{borderColor:colours().textColour}}>
            {array.map((row,rowIndex)=>(
                <div class="row g-0">
                    {row.map((cell,colIndex)=>(
                        <div class="col">
                            <div 
                                id={[rowIndex,colIndex]} 
                                class={cell===0?"editCell":"cell"}  
                                onClick={()=>setCellFocus([rowIndex,colIndex])}
                                style={{
                                    ...rowIndex===2||rowIndex===5||rowIndex===8?bottomBorder:null,
                                    ...rowIndex===0||rowIndex===3||rowIndex===6?topBorder:null,
                                    ...colIndex===2||colIndex===5||colIndex===8?rightBorder:null,
                                    ...colIndex===0||colIndex===3||colIndex===6?leftBorder:null
                                }}
                            >
                                {cell===0?"":cell}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
        <div id="finishedBanner"></div>
        <div id="message">
            <h1>Good Job</h1>
            <h3 id="tryAgain" onClick={()=>reloadPage()}>Play again?</h3>
        </div>
        
        </>
    )
    

}

export default Sadoku;