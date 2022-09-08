all: docker

docker: clean
	docker-compose up app

build: clean
	docker-compose up app --build

clean:
	docker-compose down
