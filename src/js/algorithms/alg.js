import { graph } from '../graph';
import { arrowDblClickHandler } from '../arrow/arrow.dblClickHandler';



function createDistancematrixfromConnections(graph){

    let distanceMatrix = [];
    // init distance matrix
    for (let i = 0; i < graph.countNodes; i++) {
        let row = [];
        for (let j = 0; j < graph.countNodes; j++) {
            if(i == j){
                row.push(0);
            } else {
                row.push(Infinity);
            }
        }
        distanceMatrix.push(row);
    }

    graph.connections.forEach(con => {
        let i = con.start;
        let j = con.end;
        distanceMatrix[i][j] = parseInt(graph.weights.find(w => w.arrow == con.arrow).number);
    });


    // labelCorrectingAlgorithm(graph, distanceMatrix, 0);
    return distanceMatrix;

}

function labelCorrectingAlgorithm(graph, distanceMatrix, node){

    let d = [];
    let p = [];
    let Q = [];
    Q.push(node);

    // Step 1
    for (let i = 0; i < distanceMatrix.length; i++) {
        if(i == node){
            d[i] = 0;
            p[i] = node;
        } else {
            d[i] = Number.NEGATIVE_INFINITY;
            p[i] = 0;
        }
    }

    // Step 2
    while(Q.length != 0){
        let node = Q.shift();

        graph.findNeigboursOfNode(node).forEach(neighbour => {
            let newDistance = d[node] + distanceMatrix[node][neighbour];
            if (d[neighbour] < newDistance){
                d[neighbour] = newDistance;
                p[neighbour] = node;
                if (!Q.includes(neighbour)){
                    Q.push(neighbour);
                }
            } 
        });

    }

    return d;

}



export function createTable(graph){

    let distanceMatrix = createDistancematrixfromConnections(graph);


    let ES = [];
    let EC = [];
    let LS = [];
    let LC = [];

    for (let i = 0; i < distanceMatrix.length; i++) {
        let val = labelCorrectingAlgorithm(graph, distanceMatrix, 0)[i];
        ES.push(val);
        EC.push(val + parseInt(graph.getDurationOfNode(i).number));
        let valL = labelCorrectingAlgorithm(graph, distanceMatrix, i)[0] * -1;
        LS.push(valL);
        LC.push(valL + parseInt(graph.getDurationOfNode(i).number));
        
    }

    return { ES, EC, LS, LC };

}
