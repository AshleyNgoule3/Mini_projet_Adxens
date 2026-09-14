# syntax=docker/dockerfile:1

# ---------- Etage 1 : construction ----------
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

# Les dependances d'abord : cette couche n'est reconstruite que si le pom change.
COPY pom.xml ./
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests
RUN mv target/*.jar target/app.jar

# ---------- Etage 2 : execution ----------
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Utilisateur non privilegie : aucun processus applicatif ne tourne en root.
RUN addgroup -S app && adduser -S app -G app

COPY --from=build --chown=app:app /build/target/app.jar ./app.jar

USER app
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=40s --retries=5 \
  CMD wget -qO- http://127.0.0.1:8080/actuator/health | grep -q '"status":"UP"'

ENTRYPOINT ["java", "-jar", "/app/app.jar"]