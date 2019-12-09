export default class SharedUtils {
    constructor(){
        this.stage;
        this.layer;
        this.arrowLayer;
        this.countNodes = 0;
        this.nodeConnections = [];
        this.arrowWeights = [];
    }
}

export const NODE_WIDTH = 50;
export const NODE_HEIGHT = 50;