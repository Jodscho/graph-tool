import Konva from 'konva';

const NODE_WIDTH = 50;
const NODE_HEIGHT = 50;

export function createArrow(points){
    return new Konva.Arrow({
        points: points,
        pointerLength: 10,
        pointerWidth: 10,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
    });
}


export function createRec(){
    return new Konva.Rect({
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
    });
}

export function createText(text, x, y){
    return new Konva.Text({
        x: (x) ? x : 0,
        y: (y) ? y : 0,
        text: text + '',
        align: 'center',
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fontSize: 20,
        verticalAlign: 'middle'
    });
}

export function createNodeGroup(){
    return new Konva.Group({
        x: 50,
        y: 50,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        draggable: true,
    });
}


export function createLabel(x, y){
    return new Konva.Label({
        x: x,
        y: y,
        width: 50,
        height: 50,
        opacity: 1,
        draggable: true
    });
}
