# Database Design & Optimization Report

This report documents the MongoDB schema optimizations.

---

## 1. Schema Optimization & Indexes
- **Compound Indexes**: Optimized for common search filters:
  - `Product`: `{ price: 1, category: 1 }`
  - `Review`: `{ productId: 1, rating: -1 }`
- **Text Indexing**: Active on Product `title`, `description`, and `tags` for text search.

---

## 2. Integrity & Deletion
- **Soft Deletes**: Active on critical models (e.g. Products, Users) to prevent orphan database records.
- **Audit Trails**: Changes to sensitive financial models are logged to the `PaymentAuditLog` collection.
