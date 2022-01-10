import SchemaFieldBuilder from "../../../schema-fields/SchemaFieldBuilder";

const fieldName = "organization name";

const organizationNamesArrayField =
new SchemaFieldBuilder<string[]>(fieldName)
.type([String])
.required()
.default([])
.generateSchemaFieldObject();

export default organizationNamesArrayField;