'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns `true` on the client after hydration, `false` during SSR and first client render.
 * Uses `useSyncExternalStore` for correct React 18+ hydration semantics —
 * avoids the extra render cycle of the useState + useEffect pattern.
 */
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,   // client snapshot
    () => false    // server snapshot
  );
}
