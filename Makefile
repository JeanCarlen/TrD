# Variables
COMPOSE_FILE = docker-compose.yml
SPINNER = ⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏

# Targets
.PHONY: run down clean fclean help

run:
	@echo "Starting the Docker containers..."
	@docker-compose up -d
	@echo "\nDocker containers are now running in the background."

down:
	@echo "Stopping and removing Docker containers..."
	@docker-compose -f $(COMPOSE_FILE) down
	@echo "Docker containers have been stopped and removed."

VOL:=$(shell docker volume ls -q)

clean:
	@echo "Removing Docker volumes..."
	@docker volume rm $(VOL)
	@echo "Cleanup complete."

fclean:
	@echo "Removing all unused Docker resources..."
	@docker system prune -af
	@echo "All unused Docker resources have been removed."

upfront:
	@echo "updating the front :]"
	@docker cp ./frontend/src trd-frontend-1:/app

upback:
	@echo "updating the back :]"
	@docker cp ./backend/src trd-backend-1:/app
	@docker restart trd-backend-1

reload: upfront upback
	@echo "updating the back and the front :]"

help:
	@echo "Available targets:"
	@echo "  run    : Start the Docker containers using docker-compose up."
	@echo "  down   : Stop and remove the Docker containers using docker-compose down."
	@echo "  clean  : Stop and remove volumes."
	@echo "  fclean : Perform 'clean' and remove all unused Docker resources."
	@echo "  help   : Show this help message."

.PHONY: run down clean fclean upfront upback reload help