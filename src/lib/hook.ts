/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement,
): boolean {
  const { x, y, width, height } = getElementBounds(element);

  return (
    coordinate.x >= x &&
    coordinate.y >= y &&
    coordinate.x <= x + width &&
    coordinate.y <= y + height
  );
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  if (!element || !(element instanceof HTMLElement)) {
    throw new Error("Invalid element provided.");
  }

  // Create a Range object
  const range = document.createRange();

  // Initialize the range to the start of the element
  range.setStart(element, 0);

  // Create a clone of the element to avoid affecting the actual DOM
  const clone = element.cloneNode(true);

  // Append the clone to the body for measurement
  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  document.body.appendChild(clone);

  // Measure the height of the first line
  const span = document.createElement("span");
  span.textContent = " ";
  clone.insertBefore(span, clone.firstChild);

  range.setEndAfter(span);
  const rect = range.getBoundingClientRect();

  // Clean up by removing the clone
  document.body.removeChild(clone);

  return rect.height;
}

export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[],
): HoveredElementInfo | null {}
