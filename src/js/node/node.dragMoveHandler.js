import { moveWeightLblOfArrow } from '../arrow/arrow'



export function nodeGroupDragmoveHandler(shared) {
    return function () {

        let differenceX = this.attrs.x - this.attrs.oldPosX;
        let differenceY = this.attrs.y - this.attrs.oldPosY;

        // move all durations

        let durationId = shared.durations.filter(e => e.nodeId == this._id)[0].durationId;
        let lbl = shared.layer.find('Text').filter(e => e._id == durationId)[0];
        
        lbl.setAbsolutePosition({ x: this.attrs.x, y: this.attrs.y - 50});

        shared.layer.batchDraw();
        
        // find arrows
        let startArrows = shared.findAllArrowsThatStartFromNode(this._id);
        let endArrows = shared.findAllArrowsThatEndAtNode(this._id);

        // also add unconnected start arrows
        if (shared.arrowStartNodes.length > 0) {
            let unconnectedArrows = shared.arrowStartNodes
                .filter(a => a.nodeId == this._id)
                .map(a => a.arrowId);
            startArrows = Array.from(new Set(startArrows.concat(...unconnectedArrows)));
        }

        // do nothing if there are no arrows
        if (startArrows.length == 0 && endArrows.length == 0) {
            return;
        }

        startArrows.forEach(id => {
            let arrow = shared.arrowLayer.find('Arrow').filter(e => e._id == id)[0];
            // let len = arrow.attrs.points.length;
            let startx = arrow.attrs.points[0] + differenceX;
            let starty = arrow.attrs.points[1] + differenceY;

            moveWeightLblOfArrow(shared, arrow, differenceX, differenceY);

            arrow.attrs.points[0] = startx;
            arrow.attrs.points[1] = starty;

            // arrow.setPoints([startx, starty, arrow.attrs.points[2], arrow.attrs.points[3]]);
        });

        endArrows.forEach(id => {
            let arrow = shared.arrowLayer.find('Arrow').filter(e => e._id == id)[0];
            let len = arrow.attrs.points.length;

            let endx = arrow.attrs.points[len - 2] + differenceX;
            let endy = arrow.attrs.points[len - 1] + differenceY;

            moveWeightLblOfArrow(shared, arrow, differenceX, differenceY);


            arrow.attrs.points[len - 2] = endx;
            arrow.attrs.points[len - 1] = endy;

            // arrow.setPoints([arrow.attrs.points[0], arrow.attrs.points[1], endx, endy]);
        });

        this.attrs.oldPosX = this.attrs.x;
        this.attrs.oldPosY = this.attrs.y;

       
        shared.arrowLayer.batchDraw();
    }
}