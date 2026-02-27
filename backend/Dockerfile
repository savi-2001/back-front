FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos solo el pom.xml y descargamos dependencias (aprovecha el caché de Docker)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente y compilamos el JAR
COPY src ./src
RUN mvn clean package -DskipTests

# --- ETAPA 2: Ejecución (Runtime) ---
# Usamos la imagen que pediste originalmente
FROM eclipse-temurin:17.0.18_8-jre-noble
WORKDIR /app

# Seguridad: Usuario sin privilegios
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copiamos el JAR generado en la etapa de "build"
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
