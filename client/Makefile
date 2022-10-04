all: build

build:
	npm run build
	serve -s build

maintenance:
	mv public/index.html public/index.html.tmp
	mv public/index.html.maint public/index.html
	mv public/index.html.tmp public/index.html.maint
	rm -f build/index.html
	cp public/index.html build/index.html
