'use client';

import React from 'react';
import { useHydrated } from '../hooks/useHydrated';

/**
 * A reusable boundary component that only renders children after hydration.
 * Use this to wrap any client-only content that would cause a hydration mismatch.
 *
 * @example
 * <HydrationBoundary fallback={<Skeleton />}>
 *   <DynamicClientWidget />
 * </HydrationBoundary>
 */
export default function HydrationBoundary({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const hydrated = useHydrated();
  return <>{hydrated ? children : fallback}</>;
}
