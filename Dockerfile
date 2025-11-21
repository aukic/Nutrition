# STAGE 1: Build
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copy configuration
COPY pom.xml .
RUN mvn dependency:go-offline

# 2. Copy Source Code
COPY src ./src
COPY frontend ./frontend

RUN rm -rf frontend/node_modules
RUN rm -rf frontend/dist
RUN rm -rf frontend/build

# 4. Build (Clean is important here)
RUN mvn clean package -DskipTests

# STAGE 2: Runtime
FROM amazoncorretto:21.0.4-alpine3.20
WORKDIR /app
COPY --from=build /app/target/nutrition.jar .
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/nutrition.jar"]
