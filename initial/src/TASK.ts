import { Application, Container, DEG_TO_RAD, Graphics, Resource, Sprite, Text, Texture, Ticker } from "pixi.js";

import { preloader } from "./preloader";
import list from './assets';
import { gsap } from 'gsap';
import { selectTexture } from "./texture";
import { allcards, C_height, C_width, DrawCard, shuffleCards } from "./cardsloader";
export class Game {
    app: Application;
    stage: Container;
    game: Container;
    starting: Container;
    ending: Container;
    endtone:number=0;
    index: number;
    card1: DrawCard | undefined;
    card2: DrawCard | undefined;
    playing: boolean | undefined;
    audio: HTMLAudioElement;
    constructor(app: Application) {
        this.index = 2;
        this.app = app;
        this.stage = app.stage
        this.starting = new Container();
        this.stage.addChild(this.starting);
        this.game = new Container();
        this.stage.addChild(this.game);
        this.ending = new Container();
        this.stage.addChild(this.ending);
        this.audio = document.querySelector('audio') as HTMLAudioElement;
        preloader(list, () => {
            this.createStartingScreen();
            this.createEndingScreen();
            this.starting.interactive = true;
            this.ending.interactive = true;
            this.ending.visible = false
            this.ending.buttonMode = true;
            this.starting.buttonMode = true;

            this.starting.on('click', () => {
                this.playing = true;
                (this.starting as Container).visible = false;
                (this.game as Container).visible = true;
                this.audio.src = '../assets/audio/shuffling.mp3';
                console.log(this.audio);
                this.audio.play();
                this.createcards();
            })

            this.ending.on('click', () => {
                this.playing = false;
                (this.ending as Container).visible = false;
                (this.starting as Container).visible = true;
            })
            console.log(this.app);
        });
    }
    createStartingScreen() {
        const bg = this.createRect(0, 0, this.app.view.width, this.app.view.height, '0xFFD1DE');
        this.starting.addChild(bg);
        const loading = this.createSprite(selectTexture('opening') as Texture, this.app.view.width / 2, this.app.view.height / 2 + 50);
        this.starting.addChild(loading);
        const welcome = this.createText("CLICK TO START THE GAME", this.app.view.width / 2, 30.66, 0.5);
        this.starting.addChild(welcome);
    }
    createEndingScreen() {
        const loading = this.createSprite(selectTexture('ending') as Texture, this.app.view.width / 2, this.app.view.height / 2 + 50);
        this.ending.addChild(loading);
        const welcome = this.createText("CLICK TO RESTART THE GAME", this.app.view.width / 2, 30.66, 0.5);
        this.ending.addChild(welcome);
    }
    createcards() {
        allcards.forEach((data) => {
            const card = new DrawCard('cover', { id: 'cardfront', frame: data });
            card.interactive = true;
            card.on('click', () => {
                card.interactive = false;
                this.audio.src = '../assets/audio/cardopen.wav';
                this.audio.play();
                if (card.back) {
                    card.back.visible = false;
                }
                if (this.card1) {
                    this.card2 = card
                    this.unactivatecards(false);
                    this.result();
                    // setTimeout(() => this.result(), 3000);
                }
                else {
                    this.card1 = card;
                }
            })
            this.game.addChild(card);
        })
        this.alignCards();
    }
    alignCards() {
        const w = 2 * C_width;
        const h = 2 * C_height;
        const borderSide = C_width;
        const borderTop = C_height;
        const gap = 10;
        let index = 0;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 8; j++) {

                let card = this.game.getChildAt(index);
                card.x = j * (w + gap) + borderSide;
                card.y = i * (h + gap) + borderTop;
                index++;
            }
        }
    }
    result() {
        console.log("result called")
        if (this.card1 && this.card2) {
            if (this.card1.name == this.card2.name) {
                console.log("won done");
                // let audio=document.querySelector('audio')as HTMLAudioElement
                this.audio.src = '../assets/audio/cardvanish.wav';
                this.audio.play();
                gsap.fromTo([this.card1, this.card2], { rotation: 0 }, {
                    x: this.app.view.width / 2,
                    y: this.app.view.height / 2,
                    // width: this.card1.width * 20,
                    // height: this.card1.height * 20,
                    rotation: DEG_TO_RAD * 360,
                    duration: 3,
                    onComplete: () => {

                        this.game.removeChild(this.card1 as DrawCard);
                        this.game.removeChild(this.card2 as DrawCard);
                        this.card1 = undefined;
                        this.card2 = undefined;
                        this.unactivatecards(true);
                    }
                })


            }
            else {
                this.audio.src = '../assets/audio/cardspin.wav';
                this.audio.play();
                gsap.fromTo([this.card1, this.card2], { rotation: 0 }, {
                    rotation: DEG_TO_RAD * 3600,
                    duration: 4,
                    ease: "bounce.out",
                    // repeat:10,
                    onComplete: () => {
                        ((this.card1 as DrawCard).back as Sprite).visible = true;
                        ((this.card2 as DrawCard).back as Sprite).visible = true;
                        this.card1 = undefined;
                        this.card2 = undefined;
                        console.log("loss");
                        this.unactivatecards(true);
                    }
                });

            }
        }
        // this.unactivatecards(true);

    }
    unactivatecards(value: boolean) {
        console.log("unactivate card");
        this.game.children.forEach(child => child.interactive = value)
    }
    createText(entry: string, x: number, y: number, a: number): Text {
        let text: Text = new Text(entry);
        text.position.set(x, y);
        text.anchor.set(a);
        return this.stage.addChild(text);
    }
    createRect(x: number, y: number, w: number, h: number, color: any): Graphics {
        const rect = new Graphics();
        rect.beginFill(color);
        rect.drawRect(x, y, w, h);
        rect.endFill();
        return rect;
    }
    createSprite(texture: Texture<Resource>, x: number, y: number): Sprite {
        let img = Sprite.from(texture);
        img.position.set(x, y);
        img.anchor.set(0.5);
        return this.stage.addChild(img);
    }
    gameOver() {
        if (this.playing == true && this.game.children.length == 0) {
            console.log("gameover");
            if(this.endtone==0){
            let audio=document.createElement('audio')as HTMLAudioElement
            audio.src = '../assets/audio/win.wav';
            console.log(audio);
            audio.style.visibility='none';
            document.body.append(audio);
            audio.play();
            this.endtone++;
            }
            this.game.visible = false;
            this.ending.visible = true;
        }
    }
    animate() {
        this.gameOver();
    }
}