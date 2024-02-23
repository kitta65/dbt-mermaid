PRETTIER_VERSION = 3.2.5

.phony: fmt
fmt:
	npx prettier@$(PRETTIER_VERSION) . --write

.phony: test
test:
	npx prettier@$(PRETTIER_VERSION) . --check
