# Architecture Review
## Enterprise Multi-Vendor E-Commerce Platform

This document outlines the architecture cleanup, directory structural standards, coding guidelines, and status of code modularity within the **ApexStore** project.

---

## 1. Directory Structure Cleanup & Dead Code Analysis

### Dead Code Assessment
- **`chatbot-intelligence` Module**: Initially flagged as potentially unused since it was not directly imported in `app.module.ts`. However, analysis confirmed that `ChatbotIntelligenceModule` is imported by `AgentModule`, which is in turn imported by `AppModule`. Thus, it is **active** and must not be deleted.
- **Root Scripts & Seeds**:
  - `check-credentials.js` (Root): Used for verifying MongoDB credentials.
  - `seed-test2.ts` / `seed.ts` (`backend/src/`): Database seeding scripts. 
  - These scripts are classified as **DevOps/Development utilities** and are kept to support local testing and deployment validation.

---

## 2. Platform Standardization Standards

To ensure long-term maintainability, the platform enforces the following structural and design principles:

### Backend Structure (NestJS)
All backend modules must reside in `backend/src/modules/` and conform to the following file layout:
- `*.module.ts`: Root module class declaring controller and provider bindings.
- `*.controller.ts`: Defines request routes, endpoint decorators, validation decorators, and roles-gate.
- `*.service.ts`: Implements business logic and repository queries.
- **Centralized Database**: All collection schemas are maintained under `backend/src/schemas/schemas.ts`, and concrete database access classes reside in `backend/src/repositories/concrete.repositories.ts`.

### Frontend Structure (Next.js)
- **Customer Storefront (`customer/src/app`)**: Utilizes Next.js App routing with subfolders for distinct customer paths. Shared state is managed via Zustand.
- **Merchant & Admin Portals (`seller`, `vendor`, `admin`)**: Utilizes Next.js client-side monolith pages (`/app/page.tsx`) to support high-performance rendering of tabular data, modals, settings interfaces, and real-time refresh buttons.

---

## 3. Next Steps

With the Project Audit (Phase 1) and Architecture Review (Phase 2) completed, the system foundation is clean. We are ready to proceed with implementing subsequent features in the roadmap.
