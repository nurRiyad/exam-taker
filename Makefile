.SHELL := /bin/zsh

.PHONY: precommit setup dev install generate migrate format lint typecheck test build

# Default target: run the checks and builds used before committing.
precommit: install generate migrate format lint typecheck test build

# Prepare a fresh local checkout and start the web/API development servers.
setup: install generate migrate
	$(MAKE) dev

dev:
	pnpm dev

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
