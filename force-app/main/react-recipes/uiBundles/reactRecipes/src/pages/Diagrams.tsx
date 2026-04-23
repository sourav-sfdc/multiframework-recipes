import Layout, { type RecipeItem } from '@/components/app/Layout';
import BasicDiagram from '@/recipes/diagrams/BasicDiagram';

import basicDiagramSource from '@/recipes/diagrams/BasicDiagram.tsx?shiki';

export default function Diagrams() {
  const recipes: RecipeItem[] = [
    {
      name: 'Basic Diagram',
      description:
        'Mounts a JointJS+ Paper inside a React component. Shows the imperative-library-in-React pattern: the Graph/Paper live in a ref, not state, and are torn down on unmount so route changes do not leak SVG listeners.',
      component: <BasicDiagram />,
      source: basicDiagramSource,
    },
  ];

  return <Layout header="Diagrams" recipes={recipes} />;
}
