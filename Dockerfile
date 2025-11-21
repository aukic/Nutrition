# STAGE 1: Build
# We use 'eclipse-temurin' (Debian-based) instead of Alpine for the build stage.
# This ensures the Node/Yarn binaries downloaded by your pom.xml run correctly.
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# 1. Copy pom.xml and download Java dependencies
COPY pom.xml .
# (Optional) Download dependencies to cache them.
# Note: frontend-maven-plugin downloads happen later during 'package'
RUN mvn dependency:go-offline

# 2. Copy your Java source code
COPY src ./src

# 3. Copy your React frontend source code
# IMPORTANT: This must match the <workingDirectory> in your POM
COPY frontend ./frontend

# 4. Run the build
# This triggers frontend-maven-plugin (installs Node, runs yarn build)
# and then packages the Spring Boot JAR.
RUN mvn clean package -DskipTests

# STAGE 2: Run
# We can use Alpine here for the final image to keep it small
FROM amazoncorretto:21.0.4-alpine3.20

WORKDIR /app

# 5. Copy the jar from the 'build' stage
# Your pom says <finalName>nutrition</finalName>, so it creates 'nutrition.jar'
COPY --from=build /app/target/nutrition.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/nutrition.jar"]
