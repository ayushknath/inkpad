function tiptapTextExtract(node: any, depth?: number, maxDepth: number = 3) {
  if (
    !node ||
    (maxDepth !== undefined && depth !== undefined && depth >= maxDepth)
  ) {
    return "";
  }

  let text = "";
  const currentDepth = (depth ?? 0) + 1;

  if (node.type === "text" && node.text) {
    return node.text;
  }

  if (node.content && Array.isArray(node.content)) {
    text = node.content
      .map((child: any) => tiptapTextExtract(child, currentDepth, maxDepth))
      .join("");
  }

  return text;
}

export { tiptapTextExtract };
