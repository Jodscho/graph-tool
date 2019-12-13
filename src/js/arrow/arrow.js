import { arrowDragMoveHandler} from './arrow.dragMoveHandler';
import { arrowDragEndhandler } from './arrow.dragEndHandler';
import {arrowDblClickHandler} from './arrow.dblClickHandler';
import { createLabel, createText, createArrow } from '../konva-objects/objects';

export function generateArrow(graph, rect) {

    const startx = rect.attrs.x + rect.attrs.width / 2;
    const starty = rect.attrs.y + 50;

    const arrow = createArrow([startx, starty, startx, starty + 30]);

    arrow.on('dragmove', arrowDragMoveHandler(graph, arrow, rect));
    arrow.on('dragend', arrowDragEndhandler(graph, arrow, rect));
    arrow.on('dblclick', arrowDblClickHandler(graph, arrow));
    arrow.on('click', arrowClickHandler());

    graph.addWeight(undefined, undefined, arrow._id);
    graph.addConnection(rect._id, undefined, arrow._id);

    graph.arrowLayer.add(arrow);
    graph.arrowLayer.draw();
}

function arrowClickHandler(){
    return function(e){
        if (e.evt.button === 2) {
            let len = this.attrs.points.length;
            this.attrs.points.push(this.attrs.points[len - 2]);
            this.attrs.points.push(this.attrs.points[len - 1]);
        }
    }
}

export function moveWeightLblOfArrow(graph, arrow, differenceX, differenceY) {
    let arrowWeight = graph.getWeightOfArrow(arrow._id);
    if (arrowWeight.id) {
        let lbl = graph.findKonvaLabelById(arrowWeight.id);
        lbl.setAbsolutePosition({ 
            x: lbl.attrs.x + differenceX, 
            y: lbl.attrs.y + differenceY 
        });
    }
}

export function createWeightLbl(text, x, y) {
    let lbl = createLabel(x, y);
    lbl.add(createText(text));
    return lbl;
}