/**
 * List of HTML tags that we want to ignore when finding the top level readable elements
 * These elements should not be chosen while rendering the hover player
 */
const IGNORE_LIST = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BUTTON",
  "LABEL",
  "SPAN",
  "IMG",
  "PRE",
  "SCRIPT",
];

/**
 *  **TBD:**
 *  Implement a function that returns all the top level readable elements on the page, keeping in mind the ignore list.
 *  Start Parsing inside the body element of the HTMLPage.
 *  A top level readable element is defined as follows:
 *      1. The text node contained in the element should not be empty
 *      2. The element should not be in the ignore list (also referred as the block list)
 *      3. The element should not be a child of another element that has only one child.
 *            For example: <div><blockquote>Some text here</blockquote></div>. div is the top level readable element and not blockquote
 *      4. A top level readable element should not contain another top level readable element.
 *            For example: Consider the following HTML document:
 *            <body>
 *              <div id="root"></div>
 *              <div id="content-1">
 *                <article>
 *                  <header>
 *                    <h1 id="title">An Interesting HTML Document</h1>
 *                    <span>
 *                      <address id="test">John Doe</address>
 *                    </span>
 *                  </header>
 *                  <section></section>
 *                </article>
 *              </div>
 *            </body>;
 *            In this case, #content-1 should not be considered as a top level readable element.
 */

export function getTopLevelReadableElementsOnPage(): HTMLElement[] {
  // let result: HTMLElement[] = [];
  // const children = document.querySelector("div")?.children ?? [];
  // result = Array.from(children).filter(
  //   (item) => !IGNORE_LIST.includes(item.tagName),
  // ) as HTMLElement[];

  // return result;
  const body = document.body;

  //  To filter out elements that do not have any text content
  function hasTextNode(element: HTMLElement) {
    return Array.from(element.childNodes).some(
      (node) =>
        node.nodeType === Node.TEXT_NODE && node?.textContent?.trim() !== "",
    );
  }

  function isIgnored(element: HTMLElement) {
    return IGNORE_LIST.includes(element.tagName);
  }

  function hasSingleChild(element: HTMLElement) {
    return element.children.length === 1;
  }

  function containsTopLevelReadableElement(element: HTMLElement) {
    for (let child of element.children) {
      if (
        hasTextNode(child as HTMLElement) &&
        !isIgnored(child as HTMLElement) &&
        !hasSingleChild(child as HTMLElement)
      ) {
        return true;
      }
    }
    return false;
  }

  function findTopLevelReadableElements(element: HTMLElement): HTMLElement[] {
    const result = [];

    for (let child of element.children) {
      if (
        hasTextNode(child as HTMLElement) &&
        !isIgnored(child as HTMLElement) &&
        !hasSingleChild(child as HTMLElement) &&
        !containsTopLevelReadableElement(child as HTMLElement)
      ) {
        let parentElement = child.parentElement;
        let previousElement = child;

        while (parentElement) {
          if (hasSingleChild(parentElement)) {
            previousElement = parentElement;
            parentElement = parentElement.parentElement;
          } else {
            parentElement = previousElement as HTMLElement;
            break;
          }
        }
        result.push(parentElement ?? (child as HTMLElement));
      } else {
        // Concursively go through all children
        result.push(...findTopLevelReadableElements(child as HTMLElement));
      }
    }

    return result;
  }

  return findTopLevelReadableElements(body);
}
