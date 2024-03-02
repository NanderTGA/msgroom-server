import typia from "typia";

export function transformValidationToString(validation: typia.IValidation): string {
    if (validation.success) return "";

    return validation.errors
        .map( error => `Invalid type on ${error.path}, expect to be ${error.expected}. Received value: ${error.value}`)
        .join("\n");
}