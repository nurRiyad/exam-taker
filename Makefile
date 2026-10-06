.SHELL := /bin/zsh

.PHONY: setup dev precommit install generate migrate format lint typecheck test build

# Prepare a fresh local checkout and start the web/API development servers.
setup: install generate migrate
	$(MAKE) dev

dev:
	pnpm dev

# Run the local checks and builds that should pass before committing.
# `make precommit` never applies migrations to the remote database.
precommit: install generate migrate format lint typecheck test build

install:
	. "$$HOME/.nvm/nvm.sh" && nvm install && nvm use && pnpm install

generate:
	pnpm db:generate

migrate:
	pnpm db:migrate:local

format:
	pnpm format

lint:
	pnpm lint

typecheck:
	pnpm typecheck

test:
	pnpm test

build:
	pnpm --filter web run build
	cd apps/api && pnpm exec wrangler deploy --dry-run
