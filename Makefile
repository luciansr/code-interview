run-server:
	dotnet run --project ./server/Api

deploy-server:
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 908368380853.dkr.ecr.us-east-1.amazonaws.com
	docker build -t coding-interview/app .
	docker tag coding-interview/app:latest 908368380853.dkr.ecr.us-east-1.amazonaws.com/coding-interview/app:latest
	docker push 908368380853.dkr.ecr.us-east-1.amazonaws.com/coding-interview/app:latest