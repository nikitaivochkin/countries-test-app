install: install-deps install-flow-typed

start:
	rm -rf dist
	npm start

develop:
	npm run develop

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test

test-coverage:
	npm test -- --coverage

lint:
	npx eslint . --ext js,jsx

publish:
	npm publish
