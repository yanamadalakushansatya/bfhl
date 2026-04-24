// Removed the unused import from validator.js
const { buildAdjacency, findComponents } = require('./graphBuilder');
const { hasCycle } = require('./cycleDetector');
const { pickRoot, buildNestedTree, computeDepth } = require('./treeBuilder');
const { buildSummary } = require('./summariser');

const USER_ID = 'kushansatyayanamadala_12082004'; 
const EMAIL_ID = 'ky4850@srmist.edu.in';
const COLLEGE_ROLL_NUMBER = 'RA2311003011271';

function nodeToCompact(node) {
  const childMap = {};
  for (const child of node.children) {
    Object.assign(childMap, nodeToCompact(child));
  }
  return { [node.label]: childMap };
}

function processRequest(data) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const seenEdges = new Set();
  const validEdges = [];

  const EDGE_PATTERN = /^([A-Z])->([A-Z])$/;

  for (const raw of data) {
    const line = raw.trim();

    const match = line.match(EDGE_PATTERN);
    const selfLoop = match && match[1] === match[2];

    if (!match || selfLoop) {
      invalidEntries.push(raw.trim());
      continue;
    }

    if (seenEdges.has(line)) {
      if (!duplicateEdges.includes(line)) {
        duplicateEdges.push(line);
      }
      continue;
    }

    seenEdges.add(line);
    validEdges.push({ from: match[1], to: match[2] });
  }

  const childParentMap = new Map();
  const filteredEdges = [];

  for (const edge of validEdges) {
    if (!childParentMap.has(edge.to)) {
      childParentMap.set(edge.to, edge.from);
      filteredEdges.push(edge);
    }
  }

  const { adj, radj, nodes } = buildAdjacency(filteredEdges);
  const components = findComponents(nodes, filteredEdges);

  const sortedComponents = components.sort((a, b) => {
    const rootA = pickRoot(a, radj);
    const rootB = pickRoot(b, radj);
    return rootA.localeCompare(rootB);
  });

  const hierarchies = [];

  for (const component of sortedComponents) {
    const cyclic = hasCycle(component, adj);

    if (cyclic) {
      const root = Array.from(component).sort()[0];
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const root = pickRoot(component, radj);
      const treeNode = buildNestedTree(root, adj, component);
      const compact = nodeToCompact(treeNode);
      const depth = computeDepth(treeNode);
      hierarchies.push({ root, tree: compact, depth });
    }
  }

  const summary = buildSummary(hierarchies);

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary
  };
}

module.exports = { processRequest };