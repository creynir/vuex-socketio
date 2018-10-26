/** Return normalized low case string without any non-word characters
 * @param string to normalize
 * @return string
 * @api private
 */
export function normalizeString (string) {
    return string.replace(/[\W_]/g, '').toLowerCase();
}

/** Map for channel name formatter functions
 * @api private
 */
export const formatters = {
    'CamelCase': s => toCamelCase(s),
    'PascalCase': s => toPascalCase(s),
    'UppSnakeCase': s => toSnakeCase(s).toUpperCase(),
    'LowSnakeCase': s => toSnakeCase(s).toLowerCase()
};

/** Return string in camelCase
 * @param string
 * @return string
 * @api private
 */
function toCamelCase (string) {
    const pStr = toPascalCase(string);
    return pStr.charAt(0).toLowerCase() + pStr.slice(1);
}

/** Return string in PascalCase
 * @param string
 * @return string
 * @api private
 */
function toPascalCase (string) {
    return toSpaceCase(string)
        .replace(/\w\S*/g, s => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase())
        .replace(/\s+/g, '');
}

/** Return string in snake_case
 * @param string
 * @return string
 * @api private
 */
function toSnakeCase (string) {
    return toSpaceCase(string).replace(/\s+/g, '_');
}

/** Return string in space case
 * @param string
 * @return string
 * @api private
 */
function toSpaceCase (string) {
    return string.replace(/[\W_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2');
}
