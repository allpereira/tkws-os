# syntax=docker/dockerfile:1.7

# ============================================
# Stage 1: Build
# ============================================
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache de dependências
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build
COPY src src
RUN mvn clean package -DskipTests -B

# Extrai layers do jar pra otimizar cache do Docker
RUN java -Djarmode=layertools -jar target/*.jar extract --destination extracted

# ============================================
# Stage 2: Runtime
# ============================================
FROM eclipse-temurin:21-jre-alpine

# Usuário não-root
RUN addgroup -S spring && adduser -S spring -G spring

# Curl pro healthcheck
RUN apk add --no-cache curl

WORKDIR /app

COPY --from=builder --chown=spring:spring /build/extracted/dependencies/ ./
COPY --from=builder --chown=spring:spring /build/extracted/spring-boot-loader/ ./
COPY --from=builder --chown=spring:spring /build/extracted/snapshot-dependencies/ ./
COPY --from=builder --chown=spring:spring /build/extracted/application/ ./

USER spring

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
  CMD curl -fs http://localhost:8080/actuator/health || exit 1

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+UseStringDeduplication"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]
