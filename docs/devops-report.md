# DevOps & Production Deployment Guide

This document covers containerization, monitoring, and orchestration settings.

---

## 1. Containerization & Orchestration
- **Docker Compose**: Sets up Next.js frontends, the NestJS API gateway, and MongoDB database services.
- **PM2**: Runs NestJS under cluster mode to optimize CPU core utilization.

---

## 2. CI/CD & Monitoring
- **GitHub Actions**: Automated pipeline to run test suites and build production Docker images on push events.
- **Monitoring**: Integrates Prometheus metrics with Grafana dashboards for resource monitoring.
