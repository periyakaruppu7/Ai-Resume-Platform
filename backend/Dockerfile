# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar

EXPOSE 8080

# Restrict Heap to 192M to leave headroom for ONNX C++ native memory
ENTRYPOINT ["java", "-Xms64m", "-Xmx192m", "-XX:+UseSerialGC", "-jar", "app.jar"]