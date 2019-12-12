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
        if (window.event.ctrlKey) {
            generateArrow(shared, this);
        }
    }
}

