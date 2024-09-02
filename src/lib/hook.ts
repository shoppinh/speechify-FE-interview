import { useEffect, useState } from "react";

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

  const { height } = element.getBoundingClientRect();
  if (!element.style.lineHeight || !element.style.fontSize) return height;
  return (
    Number(element.style.lineHeight) *
    Number(element.style.fontSize.split("px")[0])
  );
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
): HoveredElementInfo | null {
  const [hoveredElementInfo, setHoveredElementInfo] = useState<
  HoveredElementInfo | null
>(null);

useEffect(() => {
  const handleMouseMove = (event: MouseEvent) => {
    const hoveredElement = parsedElements.find((element) =>
      isPointInsideElement(
        { x: event.pageX, y: event.pageY },
        element
      )
    );

    if (hoveredElement) {
      const bounds = getElementBounds(hoveredElement);
      const heightOfFirstLine = getLineHeightOfFirstLine(hoveredElement);
      setHoveredElementInfo({
        element: hoveredElement,
        top: bounds.top,
        left: bounds.left,
        heightOfFirstLine,
      });
    } else {
      setHoveredElementInfo(null);
    }
  };

  window.addEventListener("mousemove", handleMouseMove);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
  };
}, [parsedElements]);

return hoveredElementInfo;
}
