import { generateArrow } from '../arrow/arrow';
import { generationDurationLbl } from '../duration/duration';
import { NODE_HEIGHT, NODE_WIDTH } from '../shared';
import { nodeDblClickHandler} from './node.dblClickHandler'
import { nodeGroupDragmoveHandler} from './node.dragMoveHandler';


function createNode(shared) {

    let rec = new Konva.Rect({
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
    });
    var textNode = new Konva.Text({
        text: shared.countNodes + '',
        align: 'center',
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fontSize: 20,
        verticalAlign: 'middle'
    });

    let group = new Konva.Group({
        x: 50,
        y: 50,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        draggable: true,
    });

    group.on('click', nodeClickHandler(shared));
    group.on('dragmove', nodeGroupDragmoveHandler(shared));
    group.on('dragstart', function () {
        this.attrs.oldPosX = this.attrs.x;
        this.attrs.oldPosY = this.attrs.y;
    });
    group.on('dragend', function () {
        delete this.attrs.oldPosX;
        delete this.attrs.oldPosY;
    });

    group.add(rec);
    group.add(textNode);

    var node = {
        name: group._id,
        connectedTo: []
    };

    shared.nodeConnections.push(node);

    return group;
}

function nodeClickHandler(shared) {
    return function (e) {


        if (!window.event.ctrlKey){
            return;
        }
        

        let arrowStartx = this.attrs.x + this.attrs.width / 2;
        let arrowStarty = this.attrs.y;

        let arrow = generateArrow(shared, this, arrowStartx, arrowStarty, arrowStartx, arrowStarty - 20);



        shared.arrowLayer.add(arrow);
        shared.arrowLayer.draw();
    }
}


export function addNewRect(shared) {
    var newRect = createNode(shared);

    let duration = generationDurationLbl(shared, newRect);
    duration.attrs.x = 50;
    duration.attrs.y = 0;

    newRect.on('dblclick', nodeDblClickHandler(shared, duration));


    shared.layer.add(newRect);
    shared.durationLayer.add(duration);

    shared.layer.draw()
    shared.durationLayer.draw();
    shared.countNodes++;

}