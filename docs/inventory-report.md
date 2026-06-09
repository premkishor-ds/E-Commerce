# Inventory Management System Report

This report outlines the design of the high-concurrency Inventory Management System.

---

## 1. Concurrency Controls & Race Condition Prevention
- **Inventory Reservation**: The system reserves stock during checkout using atomic database operations. This prevents overselling by checking availability before finalizing an order.
- **Optimistic Locking**: Leverages versioning on inventory documents to avoid dirty writes.
- **Distributed Locks**: Critical stock reservation paths utilize Mongoose transaction sessions or redlock keys to prevent race conditions during high-volume sales (e.g. Flash Sales).

---

## 2. Multi-Warehouse & Threshold Alerts
- **Multi-Warehouse Support**: Mapped via `warehouseStock` fields in the `Inventory` schema to enable localized fulfillment.
- **Low Stock Thresholds**: Real-time alerts are dispatched when stock drops below the `lowStockThreshold` target value.
