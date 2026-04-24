function pickRoot(componentNodes, radj) {
  const candidates = [];

  for (const node of componentNodes) {
    const parents = (radj.get(node) || []).filter(p => componentNodes.has(p));
    if (parents.length === 0) candidates.push(node);
  }

  if (candidates.length > 0) {
    return candidates.sort()[0];
  }

  return Array.from(componentNodes).sort()[0];
}
function buildNestedTree(node, adj, componentNodes, visited = new Set()) {
  visited.add(node);

  const childLabels = (adj.get(node) || [])
    .filter(c => componentNodes.has(c) && !visited.has(c))
    .sort();

  const children = childLabels.map(c =>
    buildNestedTree(c, adj, componentNodes, visited)
  );

  return { label: node, children };
}
function computeDepth(tree) {
  if (!tree.children || tree.children.length === 0) return 1;
  return 1 + Math.max(...tree.children.map(computeDepth));
}

module.exports = { pickRoot, buildNestedTree, computeDepth };
