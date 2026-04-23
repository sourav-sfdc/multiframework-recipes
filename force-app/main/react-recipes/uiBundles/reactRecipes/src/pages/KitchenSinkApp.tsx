/**
 * Full-screen JointJS+ kitchen-sink app.
 *
 * Rendered at /jointjs-kitchsink-app — this route is registered OUTSIDE the
 * AppLayout tree so there is no navbar, no max-width container, and no
 * surrounding chrome. The Rappid component fills the viewport.
 */
import Rappid from '@/recipes/diagrams/kitchen-sink/Rappid';
import '@/recipes/diagrams/kitchen-sink/css/styles.scss';

export default function KitchenSinkApp() {
  return (
    <div
      className="joint-app-host"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <Rappid />
    </div>
  );
}
