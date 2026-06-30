# Notes Management System

A full-stack notes workspace using Spring Boot (REST API), PostgreSQL (Supabase), and React.

## Tech Stack
- **Backend**: Spring Boot, Spring Data JPA, PostgreSQL (Supabase)
- **Frontend**: React, CSS (Grid & Flexbox)

## Configuration (`application.properties`)

```properties
spring.application.name=note
spring.datasource.url=jdbc:postgresql://aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres
spring.datasource.username=postgres.wzlmxsbbpcpkmpgbzwff
spring.datasource.password=Jas_jas101203
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
server.port=8080
```

## How to Run

### Backend
Navigate to the `backend/note` directory and run:
```powershell
.\mvnw.cmd spring-boot:run
```

### Frontend
Navigate to the `frontend` directory and run:
```powershell
npm start

The client will start at `http://localhost:3000`.
