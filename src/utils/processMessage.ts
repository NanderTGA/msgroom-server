import MarkdownIt from "markdown-it";

const md = new MarkdownIt("zero", {
    breaks     : true,
    linkify    : true,
    typographer: true,
})
    .enable([ "strikethrough", "link", "linkify", "emphasis", "escape" ]);
// eslint-disable-next-line no-multi-assign
md.renderer.rules.paragraph_open = md.renderer.rules.paragraph_close = () => "";

/**
 * Processes a message and applies the markdown rules.
 * @param message The message to process.
 * @returns The processed message.
 */
export default function processMessage(message: string): string {
    return message
        .trim()
        .split("\n")
        .map( line => md.render(line) )
        .join("\n")
        .trim();
}