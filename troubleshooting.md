# Troubleshooting Guide

---

## 0. Express Downgrade & Docker Restart for Compatibility

**Symptom:**
- Swagger UI or other middleware fails with errors related to `path-to-regexp` or route registration after upgrading Express (e.g., Express v5 beta).
- Docker Compose or MongoDB connection errors after system or Docker Desktop restart.

**Solution:**
- Downgrade Express to v4 (e.g., `npm install express@4` or `yarn add express@4`).
- Stop Docker Desktop completely (kill all Docker processes if needed), then restart Docker Desktop and wait for it to be fully running.
- Run `docker-compose up -d` to restart all services.
- Confirm MongoDB is running and accessible at the expected URI.

---

## 0.1. Swagger UI Not Working

**Symptom:**
- Navigating to `/api-docs` returns a 404, blank page, or error.
- Swagger UI does not load or shows a path-to-regexp or route registration error.

**Possible Causes:**
- Swagger UI route is registered after a catch-all or error handler route in Express.
- Express version incompatibility (v5 beta is not supported by swagger-ui-express).
- Incorrect Swagger JSDoc configuration or missing comments.

**Next Steps:**
- Ensure `app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))` is registered before any catch-all or error handler middleware.
- Confirm Express is v4, not v5.
- Check for valid Swagger JSDoc comments above all route definitions.
- Review console/server logs for specific errors.
- If still not working, try a minimal Swagger config to isolate the problem.

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
