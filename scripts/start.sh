source .env
if [ "$NODE_ENV" = "production" ]; then
  source .env.production
else
  source .env.local
fi


# 启动本地数据库
if docker container inspect ssvdb >/dev/null 2>&1; then
    echo "本地数据库已存在"
else
    echo "启动数据库..."
    docker run -itd -e POSTGRES_USER="$POSTGRES_USER" -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" -p 5432:5432 --name ssvdb postgres
fi
