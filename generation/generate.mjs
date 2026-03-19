import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Always resolve repo root relative to this script location
// <repo>/generation/generate.mjs -> root is parent folder of generation/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function writeFile(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
}

function toKebab(s) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function pluralize(resource) {
  // Minimal heuristic; can be improved later.
  if (resource === 'equipment') return 'equipment';
  if (resource.endsWith('s')) return `${resource}es`;
  return `${resource}s`;
}

function upperFirst(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function lowerFirst(s) {
  return s ? s[0].toLowerCase() + s.slice(1) : s;
}

function toIdentifierFromKebab(kebab) {
  // "repair-order" -> "repairOrder"
  return kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function parseBlocks(text, kind) {
  // kind: 'enum' | 'entity'
  const blocks = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(new RegExp(`^\\s*${kind}\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*\\{\\s*$`));
    if (!m) continue;
    const name = m[1];
    let depth = 0;
    const start = i;
    let end = i;
    for (let j = i; j < lines.length; j++) {
      const l = lines[j];
      if (l.includes('{')) depth += (l.match(/\{/g) || []).length;
      if (l.includes('}')) depth -= (l.match(/\}/g) || []).length;
      if (depth === 0 && j > i) {
        end = j;
        break;
      }
    }
    const body = lines.slice(start + 1, end).join('\n');
    blocks.push({ name, body, startLine: start, endLine: end });
    i = end;
  }
  return blocks;
}

function parseEnum(body) {
  const values = [];
  const re = /^\s*value\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/gm;
  let m;
  while ((m = re.exec(body))) values.push(m[1]);
  return { values };
}

function parseEntity(body) {
  const attrs = [];
  const lines = body.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*attribute\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{\s*$/);
    if (!m) continue;
    const name = m[1];
    let depth = 0;
    const start = i;
    let end = i;
    for (let j = i; j < lines.length; j++) {
      const l = lines[j];
      if (l.includes('{')) depth += (l.match(/\{/g) || []).length;
      if (l.includes('}')) depth -= (l.match(/\}/g) || []).length;
      if (depth === 0 && j > i) {
        end = j;
        break;
      }
    }
    const abody = lines.slice(start + 1, end).join('\n');
    const type = (abody.match(/^\s*type\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/m) || [])[1];
    const isRequired = /^\s*is required\s*;/m.test(abody);
    const isUnique = /^\s*is unique\s*;/m.test(abody);
    const isPrimary = /^\s*key primary\s*;/m.test(abody);
    const defaultValue = (abody.match(/^\s*default\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/m) || [])[1];
    const foreignRel = (abody.match(/relates\s+([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)\s*;/m) || []).slice(1);

    attrs.push({
      name,
      type,
      isRequired,
      isUnique,
      isPrimary,
      defaultValue,
      foreign: foreignRel.length ? { entity: foreignRel[0], field: foreignRel[1] } : null,
    });
    i = end;
  }

  const pk = attrs.find((a) => a.isPrimary);
  if (!pk) throw new Error('Entity missing primary key attribute');

  return { attributes: attrs, primaryKey: pk.name };
}

function parseDomainDSL(dslText) {
  const enums = {};
  const entities = {};

  for (const b of parseBlocks(dslText, 'enum')) {
    enums[b.name] = parseEnum(b.body);
  }
  for (const b of parseBlocks(dslText, 'entity')) {
    entities[b.name] = parseEntity(b.body);
  }
  return { enums, entities };
}

function prismaScalarType(dslType) {
  switch (dslType) {
    case 'string':
    case 'text':
      return 'String';
    case 'uuid':
      return 'String';
    case 'integer':
      return 'Int';
    case 'decimal':
      return 'Decimal';
    case 'date':
      return 'DateTime';
    default:
      // enum type name
      return dslType;
  }
}

function generatePrismaEnum(name, values) {
  return `enum ${name} {\n${values.map((v) => `  ${v}`).join('\n')}\n}\n`;
}

function generatePrismaModel(name, entity, allEntities) {
  const lines = [];
  lines.push(`model ${name} {`);
  for (const attr of entity.attributes) {
    if (attr.foreign) {
      // Keep scalar FK field, relation field added below
    }
    const scalar = prismaScalarType(attr.type);
    const optional = attr.isRequired || attr.isPrimary ? '' : '?';
    const parts = [`  ${attr.name} ${scalar}${optional}`];

    if (attr.isPrimary) {
      if (attr.type === 'uuid' || attr.name === 'id') parts.push('@id @default(uuid())');
      else parts.push('@id');
    }
    if (attr.isUnique && !attr.isPrimary) parts.push('@unique');
    if (attr.defaultValue) parts.push(`@default(${attr.defaultValue})`);

    lines.push(`${parts.join(' ')}`);
  }

  // Add relations for foreign keys
  for (const attr of entity.attributes.filter((a) => a.foreign)) {
    const relEntity = attr.foreign.entity;
    const relField = attr.foreign.field;
    const relName = lowerFirst(relEntity);
    // relation field must not collide; fallback to relEntity name if needed
    const relationFieldName = entity.attributes.some((a) => a.name === relName) ? `${relName}Ref` : relName;
    lines.push(
      `  ${relationFieldName} ${relEntity} @relation(fields: [${attr.name}], references: [${relField}])`
    );
  }

  // Add back-relations (required by Prisma when a relation field exists)
  // For each other entity that has a FK pointing to this model, create a list field.
  for (const [otherName, otherEntity] of Object.entries(allEntities)) {
    for (const fk of otherEntity.attributes.filter((a) => a.foreign)) {
      if (fk.foreign.entity !== name) continue;
      const candidate = pluralize(lowerFirst(otherName));
      const fieldName = lines.some((l) => l.startsWith(`  ${candidate} `))
        ? `${candidate}List`
        : candidate;
      // Avoid duplicates if multiple FKs exist (basic de-dupe)
      if (lines.some((l) => l.startsWith(`  ${fieldName} `))) continue;
      lines.push(`  ${fieldName} ${otherName}[]`);
    }
  }

  lines.push('}');
  return `${lines.join('\n')}\n`;
}

function ensurePrismaSchema({ enums, entities }, prismaPath, apply) {
  const existing = fs.existsSync(prismaPath) ? readFile(prismaPath) : '';
  const hasGenerator = /generator\s+client\s*\{/m.test(existing);
  const header = hasGenerator
    ? existing.split(/\n(?=enum|model)\b/)[0].trimEnd() + '\n\n'
    : `generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n`;

  const out = [header];

  // Preserve existing enum/model blocks not in DSL? For now, regenerate from DSL only.
  for (const [name, e] of Object.entries(enums)) out.push(generatePrismaEnum(name, e.values) + '\n');
  for (const [name, ent] of Object.entries(entities)) out.push(generatePrismaModel(name, ent, entities) + '\n');

  const next = out.join('').trimEnd() + '\n';
  if (!apply) return { changed: next !== existing, content: next };
  writeFile(prismaPath, next);
  return { changed: true, content: next };
}

function renderBackendModule(entityName, entity, resourceName, pk) {
  const className = entityName;
  const moduleName = `${className}Module`;
  const serviceName = `${className}Service`;
  const controllerName = `${className}Controller`;
  const folder = toKebab(entityName);

  // DTOs
  const enumTypes = entity.attributes
    .filter((a) => !['string', 'text', 'uuid', 'integer', 'decimal', 'date'].includes(a.type))
    .map((a) => a.type);

  const enumUnion = (typeName) => {
    // Unknown labels in DSL aren't needed; keep as string union to avoid importing Prisma enums.
    return `'${typeName}'`;
  };

  const dtoType = (attr) => {
    switch (attr.type) {
      case 'uuid':
      case 'string':
      case 'text':
        return 'string';
      case 'integer':
        return 'number';
      case 'decimal':
        return 'string';
      case 'date':
        return 'string';
      default:
        // enum
        return 'string';
    }
  };

  const createDtoLines = [];
  createDtoLines.push(`export class Create${className}Dto {`);
  for (const a of entity.attributes) {
    if (a.isPrimary && a.type === 'uuid') continue; // generated
    const opt = a.isRequired && !(a.isPrimary && a.type !== 'uuid') ? '!' : '?';
    createDtoLines.push(`  ${a.name}${opt}: ${dtoType(a)};`);
  }
  createDtoLines.push('}');

  const updateDtoLines = [];
  updateDtoLines.push(`export class Update${className}Dto {`);
  if (pk !== 'id') updateDtoLines.push(`  id?: string;`);
  for (const a of entity.attributes) {
    if (pk !== 'id' && a.name === 'id') continue;
    updateDtoLines.push(`  ${a.name}?: ${dtoType(a)} | null;`);
  }
  updateDtoLines.push('}');

  const controller = `import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Res } from '@nestjs/common';\nimport { Response } from 'express';\nimport { ${serviceName} } from './${folder}.service';\nimport { Create${className}Dto } from './dto/create-${folder}.dto';\nimport { Update${className}Dto } from './dto/update-${folder}.dto';\n\n@Controller('${resourceName}')\nexport class ${controllerName} {\n  constructor(private readonly service: ${serviceName}) {}\n\n  @Get()\n  async findAll(@Query() query: any, @Res() res: Response) {\n    const result = await this.service.findAll(query);\n    res.set('Content-Range', \`${resourceName} \${query._start || 0}-\${query._end || result.total}/\${result.total}\`);\n    res.set('Access-Control-Expose-Headers', 'Content-Range');\n    return res.json(result.data);\n  }\n\n  @Get(':${pk}')\n  findOne(@Param('${pk}') id: string) {\n    return this.service.findOne(id);\n  }\n\n  @Post()\n  create(@Body() dto: Create${className}Dto) {\n    return this.service.create(dto);\n  }\n\n  @Patch(':${pk}')\n  update(@Param('${pk}') id: string, @Body() dto: Update${className}Dto) {\n    return this.service.update(id, dto);\n  }\n\n  @Delete(':${pk}')\n  remove(@Param('${pk}') id: string) {\n    return this.service.remove(id);\n  }\n}\n`;

  const service = `import { Injectable } from '@nestjs/common';\nimport { Prisma } from '@prisma/client';\nimport { PrismaService } from '../../prisma/prisma.service';\nimport { Create${className}Dto } from './dto/create-${folder}.dto';\nimport { Update${className}Dto } from './dto/update-${folder}.dto';\n\n@Injectable()\nexport class ${serviceName} {\n  constructor(private readonly prisma: PrismaService) {}\n\n  async findAll(query: { _start?: string; _end?: string; _sort?: string; _order?: string; [key: string]: any }) {\n    const start = parseInt(query._start) || 0;\n    const end = parseInt(query._end) || 10;\n    const take = end - start;\n    const skip = start;\n    const sortField = query._sort || '${pk}';\n    const sortOrder = (query._order || 'ASC').toLowerCase() as 'asc' | 'desc';\n\n    const where: any = {};\n\n    if (query.q) {\n      const q = String(query.q);\n      const ors: any[] = [];\n      ${entity.attributes
        .filter((a) => ['string', 'text'].includes(a.type))
        .slice(0, 6)
        .map((a) => `ors.push({ ${a.name}: { contains: q, mode: 'insensitive' } });`)
        .join('\n      ')}\n      if (ors.length) where.OR = ors;\n    }\n\n    ${entity.attributes
      .filter((a) => ['string', 'text'].includes(a.type))
      .map((a) => `if (query.${a.name}) where.${a.name} = { contains: query.${a.name}, mode: 'insensitive' };`)
      .join('\n    ')}\n\n    // Enum multi-value support (e.g. status=A&status=B)\n    ${entity.attributes
      .filter((a) => !['string', 'text', 'uuid', 'integer', 'decimal', 'date'].includes(a.type))
      .map((a) => `if (query.${a.name}) { const vals = Array.isArray(query.${a.name}) ? query.${a.name} : [query.${a.name}]; where.${a.name} = vals.length > 1 ? { in: vals } : vals[0]; }`)
      .join('\n    ')}\n\n    if (query.id) {\n      const ids = Array.isArray(query.id) ? query.id : [query.id];\n      where.${pk} = { in: ids };\n    }\n\n    const [data, total] = await Promise.all([\n      this.prisma.${lowerFirst(className)}.findMany({ where, skip, take, orderBy: { [sortField]: sortOrder } }),\n      this.prisma.${lowerFirst(className)}.count({ where }),\n    ]);\n\n    const mapped = ${pk === 'id' ? 'data' : `data.map((r: any) => ({ id: r.${pk}, ...r }))`};\n    return { data: mapped, total };\n  }\n\n  async findOne(id: string) {\n    const record = await this.prisma.${lowerFirst(className)}.findUniqueOrThrow({ where: { ${pk}: id } as any });\n    return ${pk === 'id' ? 'record' : `{ id: (record as any).${pk}, ...record }`};\n  }\n\n  async create(dto: Create${className}Dto) {\n    const record = await this.prisma.${lowerFirst(className)}.create({ data: dto as any });\n    return ${pk === 'id' ? 'record' : `{ id: (record as any).${pk}, ...record }`};\n  }\n\n  async update(id: string, dto: Update${className}Dto) {\n    const data: any = { ...(dto as any) };\n    delete data.id;\n    delete data.${pk};\n    const record = await this.prisma.${lowerFirst(className)}.update({ where: { ${pk}: id } as any, data });\n    return ${pk === 'id' ? 'record' : `{ id: (record as any).${pk}, ...record }`};\n  }\n\n  async remove(id: string) {\n    const record = await this.prisma.${lowerFirst(className)}.delete({ where: { ${pk}: id } as any });\n    return ${pk === 'id' ? 'record' : `{ id: (record as any).${pk}, ...record }`};\n  }\n}\n`;

  const mod = `import { Module } from '@nestjs/common';\nimport { ${controllerName} } from './${folder}.controller';\nimport { ${serviceName} } from './${folder}.service';\n\n@Module({\n  controllers: [${controllerName}],\n  providers: [${serviceName}],\n})\nexport class ${moduleName} {}\n`;

  return {
    folder,
    files: {
      [`server/src/modules/${folder}/${folder}.controller.ts`]: controller,
      [`server/src/modules/${folder}/${folder}.service.ts`]: service,
      [`server/src/modules/${folder}/${folder}.module.ts`]: mod,
      [`server/src/modules/${folder}/dto/create-${folder}.dto.ts`]: createDtoLines.join('\n') + '\n',
      [`server/src/modules/${folder}/dto/update-${folder}.dto.ts`]: updateDtoLines.join('\n') + '\n',
    },
    moduleName,
    importPath: `./modules/${folder}/${folder}.module`,
  };
}

function renderFrontendResource(entityName, entity, resourceName, pk, enums) {
  const folder = toKebab(entityName);
  const className = entityName;
  const enumAttrs = entity.attributes.filter(
    (a) => !['string', 'text', 'uuid', 'integer', 'decimal', 'date'].includes(a.type)
  );
  const statusEnumAttr = enumAttrs.find((a) => a.name === 'status');

  const identBase = toIdentifierFromKebab(folder);
  const filtersIdent = `${identBase}Filters`;

  const hasNumber = entity.attributes.some((a) => ['integer', 'decimal'].includes(a.type));
  const hasDate = entity.attributes.some((a) => a.type === 'date');
  const hasFK = entity.attributes.some((a) => a.foreign);
  const hasNonStatusEnum = enumAttrs.some((a) => a.name !== 'status');

  const listImportSet = new Set([
    'List',
    'Datagrid',
    'TextField',
    'TextInput',
    'TopToolbar',
    'FilterButton',
    'CreateButton',
    'ExportButton',
  ]);
  if (hasNumber) listImportSet.add('NumberField');
  if (hasDate) listImportSet.add('DateField');
  if (enumAttrs.length) listImportSet.add('SelectField');
  if (hasFK) listImportSet.add('ReferenceField');
  if (statusEnumAttr) listImportSet.add('SelectArrayInput');
  if (hasNonStatusEnum) listImportSet.add('SelectInput');
  if (hasFK) {
    listImportSet.add('ReferenceInput');
    listImportSet.add('AutocompleteInput');
  }
  const listImports = Array.from(listImportSet);

  const choiceConsts = [];
  for (const a of enumAttrs) {
    const enumName = a.type;
    const values = enums?.[enumName]?.values ?? [];
    const constName = `${a.name}Choices`;
    if (a.name === 'status') {
      choiceConsts.push(
        `const statusChoices = [\n${values.map((v) => `  { id: '${v}', name: '${v}' },`).join('\n')}\n];\n`
      );
    } else {
      choiceConsts.push(
        `const ${constName} = [\n${values.map((v) => `  { id: '${v}', name: '${v}' },`).join('\n')}\n];\n`
      );
    }
  }

  const filterInputs = [];
  // Always include q if any string fields
  if (entity.attributes.some((a) => ['string', 'text'].includes(a.type))) {
    filterInputs.push(`<TextInput key="q" source="q" label="Поиск" alwaysOn />`);
  }
  for (const a of entity.attributes) {
    if (a.name === pk) continue;
    if (a.foreign) {
      filterInputs.push(
        `<ReferenceInput key="${a.name}" source="${a.name}" reference="${pluralize(toKebab(a.foreign.entity))}" label="${a.name}">\n    <AutocompleteInput optionText={(record) => record.code ? \`\${record.code} — \${record.name ?? record.code}\` : (record.name ?? record.id)} filterToQuery={(searchText) => ({ q: searchText })} />\n  </ReferenceInput>`
      );
      continue;
    }
    if (['string', 'text', 'uuid'].includes(a.type)) {
      filterInputs.push(`<TextInput key="${a.name}" source="${a.name}" label="${a.name}" />`);
      continue;
    }
    if (['integer', 'decimal'].includes(a.type)) continue;
    if (a.type === 'date') continue;
    // enum
    if (a.name === 'status') {
      filterInputs.push(`<SelectArrayInput key="${a.name}" source="${a.name}" label="${a.name}" choices={statusChoices} />`);
    } else {
      filterInputs.push(`<SelectInput key="${a.name}" source="${a.name}" label="${a.name}" choices={${a.name}Choices} emptyText="Все" />`);
    }
  }

  const listFields = [];
  for (const a of entity.attributes) {
    if (a.foreign) {
      listFields.push(
        `<ReferenceField source="${a.name}" reference="${pluralize(toKebab(a.foreign.entity))}" label="${a.name}" link="show">\n        <TextField source="name" />\n      </ReferenceField>`
      );
      continue;
    }
    if (a.type === 'date') {
      listFields.push(`<DateField source="${a.name}" label="${a.name}" />`);
    } else if (['integer', 'decimal'].includes(a.type)) {
      listFields.push(`<NumberField source="${a.name}" label="${a.name}" />`);
    } else if (!['string', 'text', 'uuid', 'integer', 'decimal', 'date'].includes(a.type)) {
      listFields.push(`<SelectField source="${a.name}" label="${a.name}" choices={${a.name === 'status' ? 'statusChoices' : `${a.name}Choices`}} />`);
    } else {
      listFields.push(`<TextField source="${a.name}" label="${a.name}" />`);
    }
  }

  const list = `import {\n  ${listImports.join(',\n  ')}\n} from 'react-admin';\n\n${choiceConsts.join('\n')}\nconst ${filtersIdent} = [\n  ${filterInputs.join(',\n  ')}\n];\n\nconst ${className}ListActions = () => (\n  <TopToolbar>\n    <FilterButton filters={${filtersIdent}} />\n    <CreateButton />\n    <ExportButton />\n  </TopToolbar>\n);\n\nexport const ${className}List = () => (\n  <List actions={<${className}ListActions />} filters={${filtersIdent}} sort={{ field: '${pk}', order: 'ASC' }}>\n    <Datagrid rowClick=\"show\">\n      ${listFields.join('\n      ')}\n    </Datagrid>\n  </List>\n);\n`;

  const formField = (a, mode) => {
    if (a.isPrimary && mode === 'create' && a.type === 'uuid') return null;
    if (a.isPrimary && mode === 'edit') {
      return `<TextInput source="${a.name}" label="${a.name}" disabled />`;
    }
    if (a.foreign) {
      return `<ReferenceInput source="${a.name}" reference="${pluralize(toKebab(a.foreign.entity))}" label="${a.name}">\n        <AutocompleteInput optionText={(record) => record.code ? \`\${record.code} — \${record.name ?? record.code}\` : (record.name ?? record.id)} filterToQuery={(searchText) => ({ q: searchText })} />\n      </ReferenceInput>`;
    }
    if (a.type === 'date') return `<TextInput source="${a.name}" label="${a.name}" />`;
    if (['integer', 'decimal'].includes(a.type)) return `<TextInput source="${a.name}" label="${a.name}" />`;
    if (!['string', 'text', 'uuid', 'integer', 'decimal', 'date'].includes(a.type)) {
      if (a.name === 'status' && statusEnumAttr) return `<SelectInput source="${a.name}" label="${a.name}" choices={statusChoices} emptyText="Не выбрано" />`;
      return `<SelectInput source="${a.name}" label="${a.name}" choices={${a.name}Choices} emptyText="Не выбрано" />`;
    }
    return `<TextInput source="${a.name}" label="${a.name}" ${a.isRequired ? 'isRequired' : ''} />`;
  };

  const formImportSet = new Set(['SimpleForm', 'TextInput']);
  if (enumAttrs.length) formImportSet.add('SelectInput');
  if (hasFK) {
    formImportSet.add('ReferenceInput');
    formImportSet.add('AutocompleteInput');
  }
  const createImports = ['Create', ...Array.from(formImportSet)].join(', ');
  const create = `import { ${createImports} } from 'react-admin';\n\n${choiceConsts.join('\n')}\nexport const ${className}Create = () => (\n  <Create>\n    <SimpleForm>\n      ${entity.attributes.map((a) => formField(a, 'create')).filter(Boolean).join('\n      ')}\n    </SimpleForm>\n  </Create>\n);\n`;

  const editImports = ['Edit', ...Array.from(formImportSet)].join(', ');
  const edit = `import { ${editImports} } from 'react-admin';\n\n${choiceConsts.join('\n')}\nexport const ${className}Edit = () => (\n  <Edit>\n    <SimpleForm>\n      ${entity.attributes.map((a) => formField(a, 'edit')).filter(Boolean).join('\n      ')}\n    </SimpleForm>\n  </Edit>\n);\n`;

  const show = `import { Show, SimpleShowLayout, TextField } from 'react-admin';\n\nexport const ${className}Show = () => (\n  <Show>\n    <SimpleShowLayout>\n      ${entity.attributes.map((a) => `<TextField source="${a.name}" label="${a.name}" />`).join('\n      ')}\n    </SimpleShowLayout>\n  </Show>\n);\n`;

  return {
    files: {
      [`client/src/resources/${folder}/${className}List.tsx`]: list,
      [`client/src/resources/${folder}/${className}Create.tsx`]: create,
      [`client/src/resources/${folder}/${className}Edit.tsx`]: edit,
      [`client/src/resources/${folder}/${className}Show.tsx`]: show,
    },
    resourceName,
    className,
    folder,
  };
}

function upsertInFile(filePath, apply, updater) {
  const abs = path.join(ROOT, filePath);
  const existing = fs.existsSync(abs) ? readFile(abs) : '';
  const next = updater(existing);
  if (apply) writeFile(abs, next);
  return { changed: next !== existing, content: next };
}

function ensureAppModule(apply, backendModules) {
  return upsertInFile('server/src/app.module.ts', apply, (src) => {
    let out = src;
    for (const m of backendModules) {
      if (!out.includes(`import { ${m.moduleName} }`)) {
        out = out.replace(
          /import\s+\{\s*RepairOrderModule\s*\}[^;]*;\s*/m,
          (x) => `${x}import { ${m.moduleName} } from '${m.importPath}';\n`
        );
      }
    }
    out = out.replace(/imports:\s*\[\s*([\s\S]*?)\s*\],/m, (match, inner) => {
      let block = inner;
      for (const m of backendModules) {
        if (!block.includes(m.moduleName)) block = block.replace(/\s*\],?\s*$/m, '') + `\n    ${m.moduleName},`;
      }
      // normalize trailing comma/indent by reusing original replacement style
      return `imports: [${block}\n  ],`;
    });
    return out;
  });
}

function ensureClientApp(apply, frontendResources) {
  return upsertInFile('client/src/App.tsx', apply, (src) => {
    let out = src;
    for (const r of frontendResources) {
      const imports = [
        `import { ${r.className}List } from './resources/${r.folder}/${r.className}List';`,
        `import { ${r.className}Create } from './resources/${r.folder}/${r.className}Create';`,
        `import { ${r.className}Edit } from './resources/${r.folder}/${r.className}Edit';`,
        `import { ${r.className}Show } from './resources/${r.folder}/${r.className}Show';`,
      ];
      for (const imp of imports) {
        if (!out.includes(imp)) {
          out = out.replace(/import\s+\{\s*RepairOrderShow\s*\}[^;]*;\s*/m, (x) => `${x}\n${imports.join('\n')}\n`);
          break;
        }
      }
      if (!out.includes(`name="${r.resourceName}"`)) {
        out = out.replace(
          /<\/Admin>/m,
          `    <Resource\n      name="${r.resourceName}"\n      options={{ label: '${r.className}' }}\n      list={${r.className}List}\n      create={${r.className}Create}\n      edit={${r.className}Edit}\n      show={${r.className}Show}\n    />\n  </Admin>`
        );
      }
    }
    return out;
  });
}

/** Собирает файлы как при --apply, без записи. Учитывает текущие app.module.ts и App.tsx на диске. */
function collectGeneratedBundle(parsed) {
  const files = {};
  const prismaPath = path.join(ROOT, 'server/prisma/schema.prisma');
  const pr = ensurePrismaSchema(parsed, prismaPath, false);
  files['server/prisma/schema.prisma'] = pr.content;

  const backendModules = [];
  const frontendResources = [];
  for (const [entityName, ent] of Object.entries(parsed.entities)) {
    const pk = ent.primaryKey;
    const resource = pluralize(toKebab(entityName));
    const be = renderBackendModule(entityName, ent, resource, pk);
    const fe = renderFrontendResource(entityName, ent, resource, pk, parsed.enums);
    backendModules.push(be);
    frontendResources.push(fe);
    Object.assign(files, be.files, fe.files);
  }

  const appMod = ensureAppModule(false, backendModules);
  files['server/src/app.module.ts'] = appMod.content;
  const clientApp = ensureClientApp(false, frontendResources);
  files['client/src/App.tsx'] = clientApp.content;

  return {
    entityCount: Object.keys(parsed.entities).length,
    enumCount: Object.keys(parsed.enums).length,
    files,
  };
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const printBundleJson = args.includes('--print-bundle-json');
  const dslArgIdx = args.indexOf('--dsl');
  const dslPath = dslArgIdx >= 0 ? args[dslArgIdx + 1] : 'examples/TOiR.domain.dsl';

  const absDsl = path.resolve(ROOT, dslPath);
  const dslText = readFile(absDsl);
  const parsed = parseDomainDSL(dslText);

  if (printBundleJson) {
    const bundle = collectGeneratedBundle(parsed);
    process.stdout.write(JSON.stringify(bundle));
    return;
  }

  // Prisma schema
  const prismaPath = path.join(ROOT, 'server/prisma/schema.prisma');
  ensurePrismaSchema(parsed, prismaPath, apply);

  // Backend modules + frontend resources
  const backendModules = [];
  const frontendResources = [];
  for (const [entityName, ent] of Object.entries(parsed.entities)) {
    const pk = ent.primaryKey;
    const resource = pluralize(toKebab(entityName));
    const be = renderBackendModule(entityName, ent, resource, pk);
    const fe = renderFrontendResource(entityName, ent, resource, pk, parsed.enums);
    backendModules.push(be);
    frontendResources.push(fe);

    if (apply) {
      for (const [rel, content] of Object.entries(be.files)) writeFile(path.join(ROOT, rel), content);
      for (const [rel, content] of Object.entries(fe.files)) writeFile(path.join(ROOT, rel), content);
    }
  }

  ensureAppModule(apply, backendModules);
  ensureClientApp(apply, frontendResources);

  process.stdout.write(
    `${apply ? 'Generated' : 'Planned'} ${Object.keys(parsed.entities).length} entities from ${dslPath}\n`
  );
}

main();

