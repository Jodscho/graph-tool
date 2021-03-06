import { arrowDragMoveHandler} from './arrow.dragMoveHandler';
import { arrowDragEndhandler } from './arrow.dragEndHandler';
import {arrowDblClickHandler} from './arrow.dblClickHandler';
import { createLabel, createText, createArrow } from '../graph/graph.konva.objects';

export function generateArrow(graph, rect) {

    const startx = rect.attrs.x + rect.attrs.width / 2;
    const starty = rect.attrs.y + 50;

    const arrow = createArrow([startx, starty, startx, starty + 30]);

    initalizeArrowHandlers(graph, arrow, rect);

    graph.addWeight(undefined, undefined, arrow._id);
    graph.addConnection(rect._id, undefined, arrow._id);

    graph.arrowLayer.add(arrow);
    graph.arrowLayer.draw();
}


export function initalizeArrowHandlers(graph, arrow, rect){
    arrow.on('dragmove', arrowDragMoveHandler(graph, arrow, rect));
    arrow.on('dragend', arrowDragEndhandler(graph, arrow, rect));
    arrow.on('dblclick', arrowDblClickHandler(graph, arrow));
    arrow.on('click', arrowClickHandler(graph));
    arrow.on('mouseover', arrowMouseOverEvent(graph));
}

function arrowMouseOverEvent(graph){
    return function () {
        if (this.attrs.stroke != 'black'){
            this.attrs.stroke = 'black';
            this.attrs.fill = 'black';
            graph.arrowLayer.draw();
        }
    }
}


function arrowClickHandler(graph){
    return function(e){
        if (e.evt.button === 2) {
            let len = this.attrs.points.length;
            this.attrs.points.push(this.attrs.points[len - 2]);
            this.attrs.points.push(this.attrs.points[len - 1]);
        }
        if (window.event.altKey){
            graph.removeArrowFromGraph(this._id);
            graph.arrowLayer.draw();
            graph.layer.draw();
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