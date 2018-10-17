/**Return string in camelCase
 * @param string
 * @return string
 * @api private
 */
export function camelCase(string) {
    const pStr = pascalCase(string);
    return pStr.charAt(0).toLowerCase() + pStr.slice(1);
}

/**Return string in PascalCase
 * @param string
 * @return string
 * @api private
 */
export function pascalCase(string) {
    return spaceCase(string)
        .replace(/\w\S*/g, (s => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase()))
        .replace(/\s+/g, '');
}

/**Return string in snake_case
 * @param string
 * @return string
 * @api private
 */
export function snakeCase(string) {
    return spaceCase(string).replace(/\s+/g, '_');
}

/**Return string in space case
 * @param string
 * @return string
 * @api private
 */
export function spaceCase(string) {
    return string.replace(/[\W_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2');
}


/**Return normalized low case string without any non-word characters
 * @param string to normalize
 * @return string
 * @api private
 */
export function normalizeString(string) {
    return string.replace(/[\W_]/g, '').toLowerCase();
}

export function upperSnakeCase(string) {
    return snakeCase(string).toUpperCase();
}


export function lowerSnakeCase(string) {
    return snakeCase(string).toLocaleLowerCase();
}
