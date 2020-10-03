FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine as build-env
WORKDIR /app

COPY ./ ./

ARG VERSION
# RUN apt install node
RUN uname -a
RUN dotnet restore
RUN dotnet test ./Tests

WORKDIR /app/Api
RUN dotnet publish -c Release -o /app/out /p:Version=$VERSION

# Build runtime image 
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
ENV LANG=en_US.UTF-8
ENV ASPNETCORE_URLS=http://*:80
WORKDIR /app
COPY --from=build-env /app/out .
EXPOSE 80
ENTRYPOINT ["dotnet", "Api.dll"]