/**
 * @param {Element} neighbor
 */
export function selectNeighboringElement(neighbor) {
	if (neighbor.tagName !== "FILE-ROW") {
		return;
	}

	activeComponent.selectRow(neighbor);
	neighbor.scrollIntoView({ block: "end" });
}
