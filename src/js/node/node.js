import { generateArrow } from '../arrow/arrow';
import { nodeDblClickHandler} from './node.dblClickHandler'
import { nodeGroupDragmoveHandler} from './node.dragMoveHandler';
import { createRec, createText, createNodeGroup } from '../konva-objects/objects';


export function createNode(shared) {

    // create objects
    let rec = createRec();
    let textNode = createText(shared.countNodes);
    let group = createNodeGroup();
    let duration = createText('0', 50, 0);

    group.add(rec);
    group.add(textNode);

    // add event handlers
    group.on('click', nodeClickHandler(shared));
    group.on('dragmove', nodeGroupDragmoveHandler(shared));
    group.on('dragstart', dragStartHandler());
    group.on('dragend', dragEndHandler());
    group.on('dblclick', nodeDblClickHandler(shared, duration));

    shared.durations.push({
        durationId: duration._id,
        nodeId: group._id 
    });

    shared.nodeConnections.push({
        name: group._id,
        connectedTo: []
    });

    // add to layers
    shared.layer.add(duration)
    shared.layer.add(group);
    
    
    // update layers
    shared.layer.draw();
    shared.countNodes++;
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

function nodeClickHandler(shared) {
    return function () {
        if (window.event.altKey){
            deleteNode(shared, this);
        }
        if (window.event.ctrlKey) {
            generateArrow(shared, this);
        }
    }
}

function deleteNode(shared, nodeGroup){
    // delete node
    nodeGroup.destroy();

    // delete duration label
    let id = shared.durations
        .find(e => e.nodeId = nodeGroup._id).durationId;
    shared.layer.find('Text').filter(e => e._id == id)[0].destroy();

    // delete all arrow connections
    let startArrows = shared.findAllArrowsThatStartFromNode(nodeGroup._id);
    let endArrows = shared.findAllArrowsThatEndAtNode(nodeGroup._id);

    // also add unconnected start arrows
    if (shared.arrowStartNodes.length > 0) {
        let unconnectedArrows = shared.arrowStartNodes
            .filter(a => a.nodeId == nodeGroup._id)
            .map(a => a.arrowId);
        startArrows = Array.from(new Set(startArrows.concat(...unconnectedArrows)));
    }
    let all = startArrows.concat(endArrows);
    all.forEach(arrowId => {

        // clean up node connections 
        shared.nodeConnections.forEach(con => {
            // is this arrow somewhere in this con?
            let existIdx = con.connectedTo.findIndex(to => to.arrowId == arrowId);
            if (existIdx != -1){ 
                con.connectedTo.splice(existIdx, 1);
            }
        });

        shared.arrowLayer.find('Arrow').filter(e => e._id == arrowId)[0].destroy();
        // find arrow weights
        let arrowWeightIdx = shared.arrowWeights.findIndex(e => e.arrowId == arrowId);
        if (arrowWeightIdx != -1) {
            let weightId = shared.arrowWeights[arrowWeightIdx].weight.id;
            shared.arrowLayer.find('Label').filter(e => e._id == weightId)[0].destroy();
            shared.arrowWeights.splice(arrowWeightIdx, 1);
        }


    });


    shared.layer.draw();
    shared.arrowLayer.draw();



}

