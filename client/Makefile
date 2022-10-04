all: build

build:
	npm run build
	serve -s build

maintenance:
	mv src/index.js src/index_tmp.js
	mv src/index_maint.js src/index.js
	mv src/index_tmp.js src/index_maint.js
	rm build/index.html
	cp src/index.html build/index.html
