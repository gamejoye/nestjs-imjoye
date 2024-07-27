#!/bin/bash

# 获取参数
MIGRATION_NAME=$1

# 检查是否提供了迁移名称
if [ -z "$MIGRATION_NAME" ]; then
  echo "Error: Migration name is required."
  echo "Usage: npm run create-migration <MigrationName>"
  exit 1
fi

# 创建迁移
npx typeorm migration:create src/migrations/$MIGRATION_NAME