import type { GraphNode, GraphSnapshot, GraphEdge } from "../dto";

/**
 * Deterministic radial layout transform.
 *
 * Pure graph-data → renderable-snapshot transform. Hubs (highest degree/weight)
 * sit at the centre, leaves on the outer ring — the same algorithm the mock
 * layer used, so the canvas renders identically once data comes from CognoDB.
 * The repository calls this so the `GraphSnapshot` contract (with x/y) holds.
 */
const RING_RADIUS = [0, 17, 30, 41];

export function computeRadialLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
): GraphSnapshot {
  if (nodes.length === 0) return { nodes: [], edges };

  const positioned = nodes.map((node, i) => {
    const ring = i < 1 ? 0 : i < 7 ? 1 : i < 18 ? 2 : 3;
    const ringCount = ring === 0 ? 1 : ring === 1 ? 6 : ring === 2 ? 11 : Math.max(1, nodes.length - 18);
    const indexInRing = ring === 0 ? 0 : ring === 1 ? i - 1 : ring === 2 ? i - 7 : i - 18;
    const angle = (indexInRing / ringCount) * Math.PI * 2 + ring * 0.55;
    const radius = RING_RADIUS[ring] ?? RING_RADIUS[3];
    return {
      ...node,
      x: 50 + Math.cos(angle) * radius * 1.5,
      y: 50 + Math.sin(angle) * radius,
    };
  });

  return { nodes: positioned, edges };
}