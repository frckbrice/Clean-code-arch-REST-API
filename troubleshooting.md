# Troubleshooting Guide

This file documents common issues and solutions encountered during the setup and development of this project.

---

## 1. Docker Compose: App cannot connect to MongoDB

**Symptom:** The app fails to connect to the MongoDB service when running via `docker-compose`.

**Solution:**

- Ensure the `MONGODB_URI` in your environment variables is set to `mongodb://mongo:27017/cleanarchdb` (the service name `mongo` matches the docker-compose service).
- Run `docker-compose down -v` to remove old volumes and restart with `docker-compose up --build`.

---

## 3. MongoDB Data Persistence

**Symptom:** Data is lost after restarting containers.

**Solution:**

- The `mongo_data` volume in `docker-compose.yml` ensures data persistence. If you want a fresh DB, run `docker-compose down -v`.

---

## 4. Port Conflicts

**Symptom:** Docker fails to start due to port conflicts.

**Solution:**

- Make sure ports 5000 (app) and 27017 (MongoDB) are free or change them in `docker-compose.yml` and `.env`.

---
