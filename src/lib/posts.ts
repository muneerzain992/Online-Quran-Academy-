/** Normalize Post.contentJson (HTML string or { html }) to HTML. */
export function contentJsonToHtml(contentJson: unknown): string {
  if (typeof contentJson === "string") return contentJson;
  if (
    contentJson &&
    typeof contentJson === "object" &&
    "html" in contentJson &&
    typeof (contentJson as { html: unknown }).html === "string"
  ) {
    return (contentJson as { html: string }).html;
  }
  return "";
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
