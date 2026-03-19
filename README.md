This directory defines the AI generation context.

All code generation must follow the rules described in these documents.

## AID export (OpenAPI + app generator)

HTTP-экспортёры для интеграции с AID: **`POST /aid/export/openapi`** (api-format → OpenAPI 3.0) и **`POST /aid/export/app`** (DSL → бандл файлов или `--apply`). Подробно: **[docs/AID_EXPORT_README.md](docs/AID_EXPORT_README.md)**.