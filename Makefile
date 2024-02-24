PRETTIER_VERSION = 3.2.5
ROOT = $(shell pwd)

.phony: fmt
fmt:
	npx prettier@$(PRETTIER_VERSION) . --write

.phony: test
test:
	npx prettier@$(PRETTIER_VERSION) . --check

.phony: compile
compile:
	docker container exec dbt-mermaid-dbt-1 dbt compile --profiles-dir=/usr/app
