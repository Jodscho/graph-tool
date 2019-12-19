import { generateArrow } from '../arrow/arrow';
import { nodeDblClickHandler} from './node.dblClickHandler'
import { nodeGroupDragmoveHandler} from './node.dragMoveHandler';
import { createRec, createText, createNodeGroup } from '../graph/graph.konva.objects';


export function createNode(graph) {

    let id = graph.getUniqueNodeId();

    // create objects
    let rec = createRec();
    let textNode = createText(id);
    let group = createNodeGroup();
    let duration = createText('0', 50, 0);

    group._id = id;

    group.add(rec);
    group.add(textNode);

    // add event handlers
    initalizeNodeHandlers(graph, group, duration);

    graph.addDuration(duration._id, '0', group._id);

    // add to layers
    graph.layer.add(duration)
    graph.layer.add(group);
    
    // update layers
    graph.layer.draw();
    graph.countNodes++;
}

export function initalizeNodeHandlers(graph, group, duration){
    group.on('click', nodeClickHandler(graph));
    group.on('dragmove', nodeGroupDragmoveHandler(graph));
    group.on('dragstart', dragStartHandler());
    group.on('dragend', dragEndHandler());
    group.on('dblclick', nodeDblClickHandler(graph, duration));
}

function dragStartHandler(){
    return function(){
        this.attrs.oldPosX = this.attrs.x;
        this.attrs.oldPosY = this.attrs.y;
    }
}

function dragEndHandler() {
    return function () {
        delete this.attrs.oldPosX;
        delete this.attrs.oldPosY;
    }
}

function nodeClickHandler(graph) {
    return function () {
        if (window.event.altKey){
            deleteNode(graph, this);
        }
        if (window.event.ctrlKey) {
            generateArrow(graph, this);
        }
    }
}

function deleteNode(graph, nodeGroup){

    graph.removeNodeFromGraph(nodeGroup._id);

    graph.layer.draw();
    graph.arrowLayer.draw();
}

