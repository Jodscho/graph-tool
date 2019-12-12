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
        this.arrowStartNodes = [];
    }


    findAllArrowsThatStartFromNode(nodeId){
        return this.nodeConnections
            .map(c => c.connectedTo)
            .filter(a => a.length != 0)
            .flat()
            .filter(a => a.nodeId == nodeId)
            .map(a => a.arrowId);
    }

    findAllArrowsThatEndAtNode(nodeId){
        return this.nodeConnections
            .filter(e => e.name == nodeId)[0].connectedTo
            .map(c => c.arrowId);
    }


}

export const NODE_WIDTH = 50;
export const NODE_HEIGHT = 50;