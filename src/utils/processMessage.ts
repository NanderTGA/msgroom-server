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
    message = message
        .trim()
        .replaceAll("\n", "<BR />"); // very obscure thing nobody is gonna type in a message to prevent false positives + allows people to have newlines in their messages

    message = md
        .render(message)
        .replaceAll("&lt;BR /&gt;", "\n") // markdown-it escapes html tags
        .trim();

    return message;
}