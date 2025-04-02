# Variables
DOCKER = docker compose
EXEC = $(DOCKER) exec angular-app

# Declare PHONY targets
.PHONY: start stop dev restart logs shell # Docker Compose commands
.PHONY: install serve build watch test # Npm commands (cf: Package.json)
.PHONY: generate-component generate-service # Ng commands

# Docker commands
start:
	$(DOCKER) up -d

stop:
	$(DOCKER) down

dev: 
	$(DOCKER) up -d --build --force-recreate

restart: stop start

logs:
	$(DOCKER) logs -f

shell:
	$(EXEC) bash


# Package.json commands
install:
	$(EXEC) npm install

serve:
	$(EXEC) npm start

build:
	$(EXEC) npm build

watch:
	$(EXEC) npm watch

test:
	$(EXEC) npm test


# Angular CLI commands
generate-component:
	$(EXEC) ng generate component $(name)

generate-service:
	$(EXEC) ng generate service $(name)