run-server:
	dotnet run --project ./server/Api

deploy-server:
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 908368380853.dkr.ecr.us-east-1.amazonaws.com
	docker build --build-arg VERSION=1.0.0 -t coding-interview/app ./server
	docker tag coding-interview/app:latest 908368380853.dkr.ecr.us-east-1.amazonaws.com/coding-interview/app:latest
	docker push 908368380853.dkr.ecr.us-east-1.amazonaws.com/coding-interview/app:latest

run-peer:
	docker build --build-arg VERSION=1.0.0 -t coding-interview/peer-js ./peerjs
	docker run -i --rm -p 9000:9000 -p 80:80 coding-interview/peer-js 

run-peer-with-server:
	docker build --build-arg VERSION=1.0.0 -t coding-interview/server-and-peer-js ./server
	docker run -i --rm -p 9000:9000 -p 80:80 coding-interview/server-and-peer-js

deploy-peer:
	heroku login
	docker login --username=luciansr@gmail.com --password=$(heroku auth:token) registry.heroku.com
	docker build -t coding-interview/peer ./peerjs
	docker tag coding-interview/peer:latest registry.heroku.com/coding-peerjs/web
	docker push registry.heroku.com/coding-peerjs/web

deploy-peer-heroku:
	heroku login
	heroku container:login
	docker build -t coding-interview/peer2:latest ./peerjs
	docker tag coding-interview/peer2:latest registry.heroku.com/coding-peerjs/web
	docker push registry.heroku.com/coding-peerjs/web
	heroku container:push web
	heroku container:release web