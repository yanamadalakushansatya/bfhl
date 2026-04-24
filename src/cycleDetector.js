const WHITE = 0;
const GRAY = 1;
const BLACK = 2;

function hasCycle(componentNodes, adj) {
  const colour = {};

  for (const node of componentNodes) colour[node] = WHITE;

  function dfs(u) {
    colour[u] = GRAY;

    for (const v of (adj.get(u) || [])) {
      if (!componentNodes.has(v)) continue;
      if (colour[v] === GRAY) return true;
      if (colour[v] === WHITE && dfs(v)) return true;
    }

    colour[u] = BLACK;
    return false;
  }

  for (const node of componentNodes) {
    if (colour[node] === WHITE && dfs(node)) return true;
  }

  return false;
}

module.exports = { hasCycle };
