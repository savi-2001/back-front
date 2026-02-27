COMPOSE_FILE = docker-compose.yml

run:
	@echo "Starting containers..."
	docker compose -f $(COMPOSE_FILE) up -d

run-dev:
	@echo "Starting dev containers with hot reload..."
	docker compose -f $(COMPOSE_FILE) --profile dev up -d postgres backend-dev

# Comando para detener los contenedores sin eliminar las imágenes
stop:
	@echo "Stoping containers..."
	docker compose -f $(COMPOSE_FILE) stop

stop-dev:
	@echo "Stoping dev backend container..."
	docker compose -f $(COMPOSE_FILE) --profile dev stop backend-dev

# Comando para detener y eliminar los contenedores, redes y volúmenes
clean: stop
	@echo "Cleaning volumes, containers and networks..."
	docker compose -f $(COMPOSE_FILE) down

# Comando para construir los contenedores (sin iniciar)
build:
	@echo "Construyendo los contenedores..."
	docker compose -f $(COMPOSE_FILE) build

# Comando para reiniciar la solución
restart: stop run
	@echo "Restarting solution..."

logs:
	@echo "Microservices logs..."
	docker compose -f $(COMPOSE_FILE) logs -f

logs-dev:
	@echo "Dev backend logs..."
	docker compose -f $(COMPOSE_FILE) --profile dev logs -f backend-dev
