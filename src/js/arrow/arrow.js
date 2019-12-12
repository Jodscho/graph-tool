import { arrowDragMoveHandler} from './arrow.dragMoveHandler';
import { arrowDragEndhandler } from './arrow.dragEndHandler';
import {arrowDblClickHandler} from './arrow.dblClickHandler';
import { createLabel, createText, createArrow } from '../konva-objects/objects';

export function generateArrow(shared, rect) {

    const startx = rect.attrs.x + rect.attrs.width / 2;
    const starty = rect.attrs.y + 50;

    const arrow = createArrow([startx, starty, startx, starty + 30]);

    arrow.on('dragmove', arrowDragMoveHandler(shared, arrow, rect));
    arrow.on('dragend', arrowDragEndhandler(shared, arrow, rect));
    arrow.on('dblclick', arrowDblClickHandler(shared, arrow));
    arrow.on('click', arrowClickHandler());

    shared.arrowWeights.push({
        arrowId: arrow._id,
        weight: {
            id: undefined,
            number: undefined 
        } 
    });

    shared.arrowLayer.add(arrow);
    shared.arrowLayer.draw();
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

export function moveWeightLblOfArrow(shared, arrow, differenceX, differenceY) {
    let arrowWeight = shared.arrowWeights.find(e => e.arrowId == arrow._id);
    if (arrowWeight.weight.id != undefined) {
        let lbl = shared.arrowLayer.find('Label').filter(e => e._id == arrowWeight.weight.id)[0];
        lbl.setAbsolutePosition({ x: lbl.attrs.x + differenceX, y: lbl.attrs.y + differenceY });
    }
}

export function createWeightLbl(text, x, y) {
    let lbl = createLabel(x, y);
    lbl.add(createText(text));
    return lbl;
}