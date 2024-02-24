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
	cd project && \
	docker container run \
		--rm \
		--mount type=bind,source=$(ROOT)/project,target=/usr/app \
		ghcr.io/dbt-labs/dbt-postgres ls --profiles-dir=/usr/app
