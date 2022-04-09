#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Duely.X/Duely.X.csproj", "Duely.X/"]
RUN dotnet restore "Duely.X/Duely.X.csproj"
COPY . .
WORKDIR "/src/Duely.X"
RUN dotnet build "Duely.X.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Duely.X.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Duely.X.dll"]
