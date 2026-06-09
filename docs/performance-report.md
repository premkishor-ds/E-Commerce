# Performance Optimization Report

This report outlines the memory management and response latency optimizations.

---

## 1. Frontend Render Tuning
- **React 19 Server Components**: Moves heavy operations to the server side to reduce bundle sizes.
- **Zustand Selectors**: Optimizes hooks to prevent unnecessary React re-renders.

---

## 2. API Caching & DB Indexing
- **Database Query Tuning**: Adds indexes to filter keys (e.g. `isApproved` on Product).
- **Socket.IO Cleanups**: Regularly prunes disconnected websocket sessions to prevent memory leaks.
