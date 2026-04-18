function tiptapTextMatch(node: any, query: string): boolean {
  if (!node) return false;

  if (node.type === "text" && node.text) {
    return node.text.toLowerCase().includes(query);
  }

  if (node.content) {
    return node.content.some((child: any) => tiptapTextMatch(child, query));
  }

  return false;
}

export { tiptapTextMatch };
