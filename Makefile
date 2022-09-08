all: docker

docker:
	@printf "\e[36m\tStarting . \e[39m"
	@docker-compose down
	@printf "\e[36m. \e[39m"
	@docker-compose up app
	@printf "\e[36m.\t[ ✓ ]\e[39m"

up:
	@printf "\e[31m\tBuilding . \e[39m"
	@docker-compose down
	@printf "\e[31m. \e[39m"
	@docker-compose up app --build
	@printf "\e[31m.\t[ ✓ ]\e[39m"
