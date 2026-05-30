# Build Stage
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

COPY . .

RUN mvn -f backend/pom.xml clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/backend/target/URLSHORTNER-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]