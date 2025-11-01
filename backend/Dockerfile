# =============================
# 1️⃣ Build Stage
# =============================
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy Maven files first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source
COPY src ./src

# Force annotation processing for Lombok
RUN mvn clean package -DskipTests \
    -Dmaven.compiler.source=21 \
    -Dmaven.compiler.target=21 \
    -Dmaven.compiler.showWarnings=true \
    -Dmaven.compiler.failOnError=true \
    -X

# =============================
# 2️⃣ Runtime Stage
# =============================
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
