# STAGE 1: Build
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copy Maven config
COPY pom.xml .
RUN mvn dependency:go-offline

# 2. Copy Backend Source
COPY src ./src

# 3. WHITELIST COPY FOR FRONTEND (The Fix)
# Instead of "COPY frontend ./frontend", we copy specific files.
# This GUARANTEES that 'dist' and 'node_modules' are NOT copied.
COPY frontend/package.json frontend/package.json
COPY frontend/vite.config.js frontend/vite.config.js
COPY frontend/index.html frontend/index.html
# Adjust this if you have other config files like tailwind.config.js
# Copy the source code
COPY frontend/src frontend/src
COPY frontend/public frontend/public

# 4. Build
# We skip tests to make it faster for debugging
RUN mvn clean package -DskipTests

# STAGE 2: Runtime
FROM amazoncorretto:21.0.4-alpine3.20
WORKDIR /app
COPY --from=build /app/target/nutrition.jar .
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/nutrition.jar"]
