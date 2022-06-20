.PHONY: emulator test build ssh

emulator:
	cd db && firebase emulators:start

test:
	npm test
	
deploydb:
	cd db && firebase deploy --only database

build:
	node generate-buildno.js
	npm run build

deployapp: build
	scp -r -P 21098 ./build  wordzkvk@wordbird.app:public_html

deploy: deploydb deployapp


ssh:
	ssh -p 21098  wordzkvk@wordbird.app
