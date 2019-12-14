export default class Graph {
    constructor() {


        this.stage;
        this.layer;
        this.arrowLayer;
        this.countNodes = 0;
        this.openInputFields = []


        // connections: [
        //     {
        //         "start": id of startnode
        //         "end": id of endnode
        //         "arrow": id of arrow
        //     }
        // ]
        this.connections = [];

        // weights: [
        //     {
        //         "id": id of weight text,
        //         "number": acutal weight,
        //         "arrow": id of arrow
        //     }
        // ]
        this.weights = [];

        // durations: [
        //     {
        //         "id": id of duration text,
        //         "number": actual duration,
        //         "node": id of node
        //     }
        // ]
        this.durations = [];

    }

    addDuration(id, number, node){
        this.durations.push({
            id,
            number,
            node
        });
    }

    addWeight(id, number, arrow){
        this.weights.push({
            id,
            number,
            arrow
        });
    }

    addConnection(start, end, arrow){
        this.connections.push({
            start,
            end,
            arrow
        });
    }

    addEndpoint(arrowId, endId){
        this.connections.find(con => con.arrow == arrowId).end = endId;
    }

    getWeightOfArrow(arrowId){
        return this.weights.find(wei => wei.arrow == arrowId);
    }

    getDurationById(id){
        return this.durations.find(dur => dur.id == id);
    }

    getDurationOfNode(nodeId){
        return this.durations.find(dur => dur.node == nodeId);
    }

    arrowsThatStartFromNode(nodeId){
        return this.connections.filter(con => con.start == nodeId).map(con => con.arrow);
    }

    arrowsThatEndAtNode(nodeId){
        return this.connections.filter(con => con.end == nodeId).map(con => con.arrow);

    }

    findAllUnconnectedArrows(){
        return this.connections.filter(con => con.end == undefined);
    }

    checkArrowEndpoint(arrowId){
        return this.connections.filter(con => con.arrow == arrowId).map(con => con.end);
    }

    removeArrowEndpoint(arrowId){
        this.connections.filter(con => con.arrow == arrowId).end = undefined;
    }

    isNodeEndpointForArrow(arrowId, nodeId){
        let con = this.connections.filter(con => arrowId == con.arrow);

        if(con.end != undefined && con.end == nodeId){
            return true;
        } 

        return false;

    }

    removeDurationLblFromGraph(durationId){
        let idx = this.durations.findIndex(dur => dur.id == durationId);
        if(idx != -1){
            this.durations.splice(idx, 1);
            this.findKonvaTextById(durationId).destroy();
        }
    }

    removeWeightLblFromGraph(weightId){
        let idx = this.weights.findIndex(wei => wei.id == weightId);
        if (idx != -1) {
            this.weights.splice(idx, 1);
        } 
        // might not exist
        let txtLbl = this.findKonvaLabelById(weightId);
        if (txtLbl){
            txtLbl.destroy();
        }
    }

    removeArrowFromGraph(arrowId){
        // remove arrow
        let idx = this.connections.findIndex(con => con.arrow == arrowId);
        if(idx != -1) {
            this.connections.splice(idx, 1);
            this.findKonvaArrowById(arrowId).destroy();
        }
        // remove weight label
        let weight = this.weights.find(wei => wei.arrow == arrowId);
        if (weight){
            this.removeWeightLblFromGraph(weight.id);
        }
    }


    removeNodeFromGraph(nodeId){
        // get all connections where this node is start or endpoint
        let cons = this.connections.filter(con => con.start == nodeId || con.end == nodeId); 

        // remove all arrows 
        cons.forEach(con => {
            this.removeArrowFromGraph(con.arrow);
        });

        // remove duration lbl
        let durationId = this.durations.find(dur => dur.node == nodeId).id;
        this.removeDurationLblFromGraph(durationId);

        this.findKonvoNodeGroupById(nodeId).destroy();

    }

    findKonvaLabelById(id){
        return this.layer.find('Label').filter(e => e._id == id)[0];
    }

    findKonvaTextById(id){
        return this.layer.find('Text').filter(e => e._id == id)[0];
    }

    findKonvaArrowById(id){
        return this.arrowLayer.find('Arrow').filter(e => e._id == id)[0];
    }

    findKonvoNodeGroupById(id){
        return this.layer.find('Group').filter(e => e._id == id)[0];
    }

    checkOpenInputFields(id) {
        return this.openInputFields.findIndex(e => e == id) != -1;
    }

    addOpenInputField(id){
        this.openInputFields.push(id);
    }

    removeFromOpenInputFields(id){
        let i = this.openInputFields.findIndex(e => e == id);
        if (i != -1) {  
            this.openInputFields.splice(i, 1);
        }
    }



}
export const NODE_WIDTH = 50;
export const NODE_HEIGHT = 50;