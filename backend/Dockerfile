# Stage 1: build
FROM eclipse-temurin:21-jdk as builder
WORKDIR /workspace/app

# copy maven wrapper and project files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# ensure mvnw is executable (Linux)
RUN chmod +x ./mvnw

# build the project (skip tests to speed up)
RUN ./mvnw -DskipTests package

# Stage 2: runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
VOLUME /tmp

# Copy jar from builder stage
COPY --from=builder /workspace/app/target/ERP-CRM.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]