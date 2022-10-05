all: docker

docker: clean launch

re: clean build launch

build:
	@docker-compose up -d --build

launch:
	@docker-compose up

clean:
	docker-compose down
