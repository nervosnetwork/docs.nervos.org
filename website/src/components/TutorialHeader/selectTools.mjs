/**
 * @template T
 * @param {T[]} baseTools
 * @param {T[] | undefined} customTools
 * @param {T[] | undefined} requiredTools
 * @returns {T[]}
 */
export function selectTutorialTools(baseTools, customTools, requiredTools) {
  if (requiredTools) {
    return requiredTools;
  }

  return customTools ? [...baseTools, ...customTools] : baseTools;
}
