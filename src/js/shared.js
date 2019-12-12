export default class SharedUtils {
    constructor(){
        this.stage;
        this.layer;
        this.arrowLayer;
        this.countNodes = 0;
        this.openInputFields = []
        this.nodeConnections = [];
        this.arrowWeights = [];
        this.durations = [];
    }
}

export const NODE_WIDTH = 50;
export const NODE_HEIGHT = 50;