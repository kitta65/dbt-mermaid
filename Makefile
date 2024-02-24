PRETTIER_VERSION = 3.2.5
ROOT = $(shell pwd)

.phony: fmt
fmt:
	npx prettier@$(PRETTIER_VERSION) . --write
	pipx run --spec shandy-sqlfmt[jinjafmt] sqlfmt ./project/models

.phony: test
test:
	npx prettier@$(PRETTIER_VERSION) . --check
	pipx run --spec shandy-sqlfmt[jinjafmt] sqlfmt --check ./project/models

.phony: compile
compile:
	docker container exec dbt-mermaid-dbt-1 dbt compile --profiles-dir=/usr/app
