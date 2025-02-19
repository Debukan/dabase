#!/bin/bash

# Загружаем переменные окружения
source ../.env

# Создаем директорию для бэкапов если её нет
BACKUP_DIR="/var/backups/postgres"
mkdir -p $BACKUP_DIR

# Формируем имя файла бэкапа с текущей датой
BACKUP_FILE="$BACKUP_DIR/dabase_$(date +%Y%m%d_%H%M%S).sql"

# Создаем бэкап
docker exec dabase_db_1 pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_FILE

# Сжимаем бэкап
gzip $BACKUP_FILE

# Удаляем бэкапы старше 30 дней
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Выводим информацию о созданном бэкапе
echo "Backup created: ${BACKUP_FILE}.gz"
