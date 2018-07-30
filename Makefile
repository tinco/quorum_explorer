.PHONY: dev
dev:
	docker run -it --rm -v $$PWD:/app -p 5000:5000 ruphin/webdev npm run dev

.PHONY: shell
shell:
	docker run -it --rm -v $$PWD:/app ruphin/webdev bash

.PHONY: test
test:
	docker run -it --rm -v $$PWD:/app ruphin/webdev npm run test

.PHONY: build
build:
	docker run -it --rm -v $$PWD:/app ruphin/webdev npm run build

.PHONY: production
production: build
	docker build -t tinco/quorum_explorer .
