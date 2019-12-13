import { moveWeightLblOfArrow } from '../arrow/arrow'



export function nodeGroupDragmoveHandler(graph) {
    return function () {

        let differenceX = this.attrs.x - this.attrs.oldPosX;
        let differenceY = this.attrs.y - this.attrs.oldPosY;

        // move all durations

        let durationId = graph.getDurationOfNode(this._id).id;
        let lbl = graph.findKonvaTextById(durationId);
        
        lbl.setAbsolutePosition({ x: this.attrs.x, y: this.attrs.y - 50});

        graph.layer.batchDraw();
        
        // find arrows
        let startArrows = graph.arrowsThatStartFromNode(this._id);
        let endArrows = graph.arrowsThatEndAtNode(this._id);

        // do nothing if there are no arrows
        if (startArrows.length == 0 && endArrows.length == 0) {
            return;
        }

        startArrows.forEach(id => {
            let arrow = graph.findKonvaArrowById(id);
            let startx = arrow.attrs.points[0] + differenceX;
            let starty = arrow.attrs.points[1] + differenceY;

            moveWeightLblOfArrow(graph, arrow, differenceX, differenceY);

            arrow.attrs.points[0] = startx;
            arrow.attrs.points[1] = starty;
        });

        endArrows.forEach(id => {
            let arrow = graph.findKonvaArrowById(id);
            let len = arrow.attrs.points.length;

            let endx = arrow.attrs.points[len - 2] + differenceX;
            let endy = arrow.attrs.points[len - 1] + differenceY;

            moveWeightLblOfArrow(graph, arrow, differenceX, differenceY);

            arrow.attrs.points[len - 2] = endx;
            arrow.attrs.points[len - 1] = endy;
        });

        this.attrs.oldPosX = this.attrs.x;
        this.attrs.oldPosY = this.attrs.y;

       
        graph.arrowLayer.batchDraw();
    }
}