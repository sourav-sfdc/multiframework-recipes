/// <reference types="vite/client" />

declare module '*?shiki' {
  const html: string;
  export default html;
}

// The JointJS+ kitchen-sink demo is vendored as-is (.jsx + service classes)
// under src/recipes/diagrams/kitchen-sink. We excluded the dir from tsc to
// skip type-checking it, but we still import Rappid.jsx from KitchenSink.tsx.
declare module '@/recipes/diagrams/kitchen-sink/Rappid' {
  import type { ComponentType } from 'react';
  const Rappid: ComponentType;
  export default Rappid;
}
declare module './kitchen-sink/Rappid' {
  import type { ComponentType } from 'react';
  const Rappid: ComponentType;
  export default Rappid;
}
