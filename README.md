# PsyCare API

Psychological appointment scheduling backend built with **.NET 8 Clean Architecture**.

## Tech Stack

- .NET 8
- ASP.NET Web API
- MediatR
- Entity Framework Core
- PostgreSQL (Docker)
- Clean Architecture

## Features Implemented

- Appointment booking endpoint
- Domain-driven entities
- Slot conflict detection
- PostgreSQL persistence
- EF Core migrations

## Architecture

API → Application → Domain → Infrastructure

## Running Locally

Start PostgreSQL:

docker run --name psycare-postgres \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=psycare_db \
-p 5433:5432 -d postgres:16

Run the API:

dotnet run --project PsyCare.API
