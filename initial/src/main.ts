import { Application } from "pixi.js";
import { Game } from "./TASK";
import '../css/style.css';

const audio=document.createElement("audio");
audio.style.visibility='none';
document.body.append(audio);
const canvas:HTMLCanvasElement=document.getElementById("canvas")as HTMLCanvasElement;
const app= new Application({
    view:canvas,
    width:1050,
    height:850,
    backgroundColor:0xff,
    sharedTicker:true,
    sharedLoader:true
});

const task=new Game(app);
app.ticker.add(task.animate.bind(task));