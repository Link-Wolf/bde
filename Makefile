all: docker

docker: clean
	@printf "\e[36m\tStarting . . .\e[39m"
	@docker-compose up app

build: clean
	@printf "\e[31m\tBuilding . . .\e[39m"
	@docker-compose up app --build

clean:
	docker-compose down
