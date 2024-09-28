import { getLeftSplit, getRightSplit } from "./barTools";

function getEdgeFromClick(event: MouseEvent, isScroller: Element) {
    const rect = isScroller.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;

    if (offsetX > (rect.width - 40)) return 'right';
    if (offsetX < 40) return 'left';

    return null;
}


export function clickRightEdge(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const isScroller = target.closest('.cm-scroller');
    if (!isScroller) return
    const edge = getEdgeFromClick(e, isScroller);
    if (!edge) return
    if (edge === 'right') {
        getRightSplit().toggle()
    } else if (edge === 'left') {
        getLeftSplit().toggle()
    }
}