import { ILoaderResource, Resource, Texture } from "pixi.js";


let texture: { [key: string]: Texture<Resource> } = {} as { [key: string]: Texture<Resource> };
export function loadtexture(res: { [key: string]: ILoaderResource }) :{ [key: string]: Texture<Resource> }{
    const keys = Object.keys(res);
    console.log(keys);
    keys.forEach(ele => {
        // console.log(res[ele], ele);
        // console.log(res[ele].texture);
        texture[ele] = res[ele].texture as Texture<Resource>
        // console.log(texture[ele]);
    });
    // texture=loader.resources('xyz').texture
    // console.log(texture);
    return texture;
}
export function selectTexture(id:string):Texture<Resource>|null{
    if(id in texture){
        // console.log("selected",texture[id],"selected");
        return texture[id] as Texture<Resource>
    }
    return null;
}