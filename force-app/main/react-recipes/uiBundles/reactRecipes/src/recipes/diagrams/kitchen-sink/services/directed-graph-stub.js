// Local stub for @joint/layout-directed-graph.
//
// The real package requires the JointJS+ private npm registry. Until it's
// installed (root-level: `JOINTJS_NPM_TOKEN=… npm install @joint/layout-directed-graph`),
// the toolbar's Layout buttons (TB/BT/LR/RL) no-op via this stub.
//
// To restore full functionality: replace the import in toolbar-service.js back
// to `import { DirectedGraph } from '@joint/layout-directed-graph';`
export const DirectedGraph = {
    layout() {
        // no-op: auto-layout disabled until the real package is installed
    },
};
