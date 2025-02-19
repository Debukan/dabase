#!/bin/bash

# Загружаем переменные окружения
source ../.env

# Проверяем передан ли файл бэкапа
if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    exit 1
fi

BACKUP_FILE=$1

# Проверяем существование файла
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file $BACKUP_FILE not found!"
    exit 1
fi

# Разархивируем файл во временную директорию
TMP_FILE="/tmp/restore_db_$(date +%s).sql"
gunzip -c "$BACKUP_FILE" > "$TMP_FILE"

# Останавливаем приложение
docker-compose down

# Запускаем только базу данных
docker-compose up -d db
sleep 10  # Ждем запуска базы

# Восстанавливаем из бэкапа
cat "$TMP_FILE" | docker exec -i dabase_db_1 psql -U $POSTGRES_USER -d $POSTGRES_DB

# Удаляем временный файл
rm "$TMP_FILE"

# Запускаем приложение
docker-compose up -d

echo "Database restored successfully!"
