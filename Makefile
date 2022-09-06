all: docker

docker:
	docker-compose down
	docker-compose up app

build:
	docker-compose down
	docker-compose up app --build
