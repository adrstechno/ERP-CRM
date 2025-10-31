# =========================
# Stage 1 — Build the JAR
# =========================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy only pom first to leverage Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy the actual source
COPY src ./src

# 👇 Force annotation processing explicitly for Lombok
RUN mvn clean compile -DskipTests -Dmaven.compiler.forceJavacCompilerUse=true \
    && mvn package -DskipTests

# =========================
# Stage 2 — Run the JAR
# =========================
FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY --from=build /app/target/ERP-CRM.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
