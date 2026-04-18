function tiptapTextSearch(node: any, query: string): boolean {
  if (!node) return false;

  if (node.type === "text" && node.text) {
    return node.text.toLowerCase().includes(query);
  }

  if (node.content) {
    return node.content.some((child: any) => tiptapTextSearch(child, query));
  }

  return false;
}

export { tiptapTextSearch };
