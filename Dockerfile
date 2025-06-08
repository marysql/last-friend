# Use uma imagem oficial do Maven com Java 17 para build
FROM maven:3.9.4-eclipse-temurin-17 AS build

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia o pom.xml e o Maven Wrapper para cache de dependências
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Baixa as dependências (aqui evita baixar toda vez que só o código muda)
RUN ./mvnw dependency:go-offline

# Copia o restante do código-fonte
COPY src src

# Builda o projeto, gerando o JAR
RUN ./mvnw clean package -DskipTests

# Segunda etapa: imagem mais leve só com Java para rodar o app
FROM eclipse-temurin:17-jre

# Diretório de trabalho
WORKDIR /app

# Copia o JAR da etapa anterior para a imagem final
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta que seu Spring Boot vai usar
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
