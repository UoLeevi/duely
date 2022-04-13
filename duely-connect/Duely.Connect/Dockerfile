#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Duely.Connect/Duely.Connect.csproj", "Duely.Connect/"]
RUN dotnet restore "Duely.Connect/Duely.Connect.csproj"
COPY . .
WORKDIR "/src/Duely.Connect"
RUN dotnet build "Duely.Connect.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Duely.Connect.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Duely.Connect.dll"]
