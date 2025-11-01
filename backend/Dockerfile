
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy the Maven project files
COPY pom.xml .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline

# Copy the entire source code
COPY src ./src

# Compile and package (skip tests for faster builds)
RUN mvn clean package -DskipTests

# Runtime Stage

FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
