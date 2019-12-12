export function generationDurationLbl(shared, nodeGroup){
    var durationLbl = new Konva.Text({
        text: '0',
        align: 'center',
        width: 50,
        height: 50,
        fontSize: 20,
        verticalAlign: 'middle'
    });


    shared.durations.push({durationId: durationLbl._id, nodeId: nodeGroup._id});
    return durationLbl;

}