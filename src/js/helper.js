import { NODE_WIDTH, NODE_HEIGHT } from './graph/graph';

export function createInputField(graph, value, x, y) {
    let containerRect = graph.stage.container().getBoundingClientRect();
    let input = document.createElement("input");
    document.body.appendChild(input);
    input.style.position = 'absolute';
    input.type = 'text';
    input.value = value;
    input.className = 'nodeInput';
    input.style.top = containerRect.top + y + 'px';
    input.style.left = containerRect.left + x + 'px';
    input.style.width = NODE_WIDTH + 'px';
    input.style.height = NODE_HEIGHT + 'px';
    input.focus();
    return input;
}