/**
 * Basic Diagram (JointJS+)
 *
 * Mounts a JointJS+ Paper into a React-managed div and renders two
 * rectangles connected by a link. Demonstrates the imperative-library-in-React
 * pattern: the diagram lives in a ref, not state, and is torn down on unmount.
 */
import { useEffect, useRef } from 'react';
import { dia, shapes, linkTools } from '@joint/plus';
import '@joint/plus/joint-plus.css';

export default function BasicDiagram() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Graph = data model, Paper = SVG view. cellNamespace must be passed so
    // serialized cells (e.g. standard.Rectangle) resolve to their classes.
    const graph = new dia.Graph({}, { cellNamespace: shapes });

    const paper = new dia.Paper({
      el: hostRef.current!,
      model: graph,
      width: '100%',
      height: 360,
      gridSize: 10,
      drawGrid: { name: 'dot', args: { color: '#d8dde6' } },
      cellViewNamespace: shapes,
      background: { color: '#f4f6f9' },
      interactive: { linkMove: false },
      defaultLink: () =>
        new shapes.standard.Link({
          attrs: { line: { stroke: '#0176d3', strokeWidth: 2 } },
        }),
    });

    const source = new shapes.standard.Rectangle({
      position: { x: 60, y: 120 },
      size: { width: 140, height: 64 },
      attrs: {
        body: {
          fill: '#0176d3',
          stroke: '#014486',
          strokeWidth: 1,
          rx: 6,
          ry: 6,
        },
        label: { text: 'Account', fill: '#ffffff', fontWeight: 600 },
      },
    });

    const target = source.clone() as shapes.standard.Rectangle;
    target.position(320, 120);
    target.attr('body/fill', '#16325c');
    target.attr('label/text', 'Contact');

    const link = new shapes.standard.Link({
      source: { id: source.id },
      target: { id: target.id },
      attrs: { line: { stroke: '#747474', strokeWidth: 2 } },
      labels: [{ attrs: { text: { text: 'has many' } } }],
    });

    graph.addCells([source, target, link]);

    // elementTools / linkTools render on hover — a tiny taste of JointJS+ UI.
    paper.on('link:mouseenter', (linkView) => {
      linkView.addTools(
        new dia.ToolsView({
          tools: [
            new linkTools.Vertices(),
            new linkTools.TargetArrowhead(),
            new linkTools.Remove({ distance: -30 }),
          ],
        })
      );
    });
    paper.on('link:mouseleave', (linkView) => linkView.removeTools());

    // Cleanup on unmount (and on Strict Mode double-invoke in dev).
    return () => {
      paper.remove();
      graph.clear();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="w-full rounded-md border border-border overflow-hidden"
      style={{ minHeight: 360 }}
    />
  );
}
