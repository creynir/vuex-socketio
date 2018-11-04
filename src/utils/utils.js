/** Return normalized low case string without any non-word characters
 * @param string to normalize
 * @return string
 * @api private
 */
export function normalizeString (string) {
    return string.replace(/[\W_]/g, '').toLowerCase();
}

/** Return string in snake_case
 * @param string
 * @return string
 * @api private
 */
export function toUppSnakeCase (string) {
    return toSpaceCase(string).replace(/\s+/g, '_').toUpperCase();
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
