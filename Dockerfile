# Multi-stage Dockerfile for Render Deployment

# Stage 1: Build React static bundle using Node 20
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot JAR with Maven JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B
COPY backend/src ./src
# Embed frontend assets into Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Production JRE 17 Runtime Image using Ubuntu/glibc support
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xms128m", "-Xmx300m", "-XX:+UseG1GC", "-jar", "app.jar"]
