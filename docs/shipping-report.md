# Shipping Management Report

This report outlines the logistics and shipping configurations.

---

## 1. Logistics Integrations
- **Carriers**: The platform architecture exposes endpoints designed for Delhivery, Shiprocket, FedEx, UPS, and DHL integrations.
- **Tracking Sync**: Asynchronous webhooks receive carrier-initiated tracking updates and propagate them to the user.

---

## 2. Admin Shipping Policies
- **Shipping Zones**: Geofenced shipping rates calculated using shipping zones.
- **Rules Engine**: Automated rules to select optimal courier service based on weight, dimensions, destination, and SLA tier.
