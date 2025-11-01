# ===========================================
# 🏗️ STAGE 1 — BUILD
# ===========================================
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml first to leverage caching of dependencies
COPY pom.xml .

# Pre-fetch dependencies (cached for faster rebuilds)
RUN mvn dependency:go-offline -B

# Copy the source code (after dependencies)
COPY src ./src

# Build the application (skip tests for faster build)
RUN mvn clean package -DskipTests

# ===========================================
# 🚀 STAGE 2 — RUNTIME
# ===========================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the packaged JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Set environment variables (optional defaults)
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
