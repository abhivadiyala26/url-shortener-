# Build Stage
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copy the entire project directory (needed because maven-resources-plugin copies from ../frontend)
COPY . .

# Build the backend application
RUN mvn -f backend/pom.xml clean package -DskipTests

# Runtime Stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the generated JAR file from the build stage
COPY --from=build /app/backend/target/URLSHORTNER-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Render sets PORT environment variable, server.port in application.properties respects this)
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
