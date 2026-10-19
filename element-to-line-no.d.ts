/**
 * Option B — find the line number of a DOM `Element` inside an Ace editor.
 *
 * The parsed DOM throws away position info, so we correlate the DOM tree
 * with the raw editor text:
 *
 *   1. Compute the element's structural path: at each level, its index among
 *      its element-only siblings (root first). Text/whitespace/comment nodes
 *      are ignored so the path matches what a source scanner sees.
 *   2. Scan the raw text once, tracking a per-depth child counter. The
 *      counter values at open time ARE the structural path of the tag being
 *      opened. Record `path|tagName -> source offset` for every tag.
 *   3. Look up the element's path and convert the offset to a row via
 *      `document.indexToPosition`.
 *
 * O(n) build per document version, O(1) lookup, cache invalidated on change.
 */
export interface AceDocumentLike {
    indexToPosition(index: number, start?: number): {
        row: number;
        column: number;
    };
}
export interface AceSessionLike {
    getValue(): string;
    getDocument(): AceDocumentLike;
    on(event: 'change', listener: () => void): void;
}
/** Structural path: index among element-only siblings at each level. */
export declare function structuralPath(el: Element): number[];
type ScanEvent = {
    kind: 'open';
    name: string;
    selfClosing: boolean;
    offset: number;
} | {
    kind: 'close';
    offset: number;
};
/**
 * Minimal XML scanner over raw source text. Skips comments, CDATA, PIs and
 * DOCTYPE as opaque blocks — they can contain `<`, `>` or text that looks
 * like tags.
 */
export declare function scanXml(src: string): Generator<ScanEvent>;
/** Build the `structuralPath|tagName -> source offset` map for a document. */
export declare function buildXmlLineMap(src: string): Map<string, number>;
/**
 * Create a lookup `lineOf(element) -> row | null` bound to an Ace session.
 * The map is built lazily and rebuilt whenever the session changes.
 */
export declare function createXmlLineLookup(session: AceSessionLike): (el: Element) => number | null;
/** One-shot lookup without caching: scan + resolve in a single call. */
export declare function findLineForElement(el: Element, session: AceSessionLike): number | null;
export {};
