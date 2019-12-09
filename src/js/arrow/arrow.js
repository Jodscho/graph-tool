import { arrowDragMoveHandler} from './arrow.dragMoveHandler';
import { arrowDragEndhandler } from './arrow.dragEndHandler';
import {arrowDblClickHandler} from './arrow.dblClickHandler';

import Konva from 'konva';

// Blueprint for any arrow that is created
var BASIC_ARROW = {
    pointerLength: 10,
    pointerWidth: 10,
    fill: 'black',
    stroke: 'black',
    strokeWidth: 2,
    draggable: true
};


export function generateArrow(shared, rect, startx, starty, endx, endy) {

    BASIC_ARROW.points = [startx, starty, endx, endy];

    let arrow = new Konva.Arrow(BASIC_ARROW);

    shared.arrowWeights.push({ arrowId: arrow._id, weight: { id: undefined, number: undefined } });

    arrow.on('dragmove', arrowDragMoveHandler(shared, arrow, rect));
    arrow.on('dragend', arrowDragEndhandler(shared, arrow, rect));
    arrow.on('dblclick', arrowDblClickHandler(shared, arrow));
    arrow.on('click', function(e){
        if (e.evt.button === 2) {
            let len = this.attrs.points.length;
            this.attrs.points.push(this.attrs.points[len-2]);
            this.attrs.points.push(this.attrs.points[len - 1]);
        }
    });

    return arrow;
}


export function moveWeightLblOfArrow(shared, arrow, differenceX, differenceY) {
    let arrowWeight = shared.arrowWeights.find(e => e.arrowId == arrow._id);
    if (arrowWeight.weight.id != undefined) {
        let lbl = shared.arrowLayer.find('Label').filter(e => e._id == arrowWeight.weight.id)[0];
        lbl.setAbsolutePosition({ x: lbl.attrs.x + differenceX, y: lbl.attrs.y + differenceY });
    }
}

export function createWeightLbl(text, x, y) {
    let simpleLabel = new Konva.Label({
        x: x,
        y: y,
        width: 50,
        height: 50,
        opacity: 1,
        draggable: true
    });

    // simpleLabel.add(
    //     new Konva.Tag({
    //         fill: 'white'
    //     })
    // );

    simpleLabel.add(
        new Konva.Text({
            text: text,
            fontFamily: 'Calibri',
            fontSize: 18,
            width: 50,
            height: 50,
            fill: 'black',
            align: 'center',
            verticalAlign: 'middle'
        })
    );


    return simpleLabel;
}