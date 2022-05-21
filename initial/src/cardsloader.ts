import { BaseTexture, Container, Rectangle, Resource, Sprite, Texture } from "pixi.js";
import { selectTexture } from "./texture";

type card={
    name:string,
    frame:number[];
}
export const allcards:card[]=[];

type cardFront={
     id:string,
     frame:card
}

export const C_width=61.38;
export const C_height=80.5;

export function creatingFrames(){
    for(let i=0;i<2;i++){
        for(let j=0;j<5;j++){
            for(let k=0;k<4;k++){
                allcards.push({
                    name:`card-${j}-${k}`,
                    frame:[ j*C_width,k*C_height,C_width,C_height]
                });
            }
        }
    }
}
creatingFrames();

export function shuffleCards(deck:card[]){
return deck.sort(() => Math.random() - 0.5);
}

export class DrawCard extends Container{
    back:Sprite|undefined
    front:Sprite
    name:string
    constructor(backImg:string,frontImg:cardFront){
        super();
        this.front=this.createCard(this.getfrontImgFromSpriteSheet(frontImg));
        this.back=this.createCard(selectTexture(backImg)as Texture);
        console.log(this.front,this.back);
        this.name=frontImg.frame.name;
    }
    createCard(texture:Texture):Sprite{
        const img=Sprite.from(texture);
        img.anchor.set(0.5);
        img.width=2*C_width;
        img.height=2*C_height;
        // img.position.set(img.width/2,img.height/2);
        return this.addChild(img);
    }
    getfrontImgFromSpriteSheet(detail:cardFront):Texture{
        const base=new BaseTexture((selectTexture(detail.id)as Texture).textureCacheIds[1]);
        const selectedPortion= new Texture(base,new Rectangle(...detail.frame.frame));
        console.log(selectedPortion);
        return selectedPortion;
    }
}