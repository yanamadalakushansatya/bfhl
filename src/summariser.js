function buildSummary(hierarchies) {
  const trees = hierarchies.filter(h => !h.has_cycle);
  const cycles = hierarchies.filter(h => h.has_cycle);

  let largest_tree_root = '';

  if (trees.length > 0) {
    const best = trees.reduce((champion, contender) => {
      if (contender.depth > champion.depth) return contender;
      if (contender.depth === champion.depth && contender.root < champion.root) return contender;
      return champion;
    });
    largest_tree_root = best.root;
  }

  return {
    total_trees: trees.length,
    total_cycles: cycles.length,
    largest_tree_root
  };
}

module.exports = { buildSummary };
