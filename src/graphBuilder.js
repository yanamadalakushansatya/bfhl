function buildAdjacency(edges) {
  const adj = new Map();
  const radj = new Map();
  const nodes = new Set();

  for (const { from, to } of edges) {
    nodes.add(from);
    nodes.add(to);

    if (!adj.has(from)) adj.set(from, []);
    if (!adj.has(to)) adj.set(to, []);
    if (!radj.has(from)) radj.set(from, []);
    if (!radj.has(to)) radj.set(to, []);

    adj.get(from).push(to);
    radj.get(to).push(from);
  }

  return { adj, radj, nodes };
}
function findComponents(nodes, edges) {
  const parent = {};

  function find(x) {
    if (parent[x] === undefined) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function unite(a, b) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }

  for (const n of nodes) find(n);

  for (const { from, to } of edges) unite(from, to);

  const groups = new Map();
  for (const n of nodes) {
    const root = find(n);
    if (!groups.has(root)) groups.set(root, new Set());
    groups.get(root).add(n);
  }

  return Array.from(groups.values());
}

module.exports = { buildAdjacency, findComponents };
