# Warehouse Management System (WMS) Report

This report outlines the design of the Warehouse Management System.

---

## 1. Physical Layout Hierarchy
To maximize fulfillment speeds, warehouses are organized using a hierarchical model:
`Warehouse` ➔ `Zone` ➔ `Rack` ➔ `Shelf` ➔ `Bin`

SKUs are mapped directly to physical bin locations, allowing pickers to find items quickly.

---

## 2. Inbound & Outbound Flows
- **Inbound Receipts**: Scans incoming inventory batches and updates warehouse inventory balances.
- **Outbound Picking**: Generates picking lists sorted by warehouse zone to minimize picker travel times.
