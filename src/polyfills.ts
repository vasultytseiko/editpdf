
export function assign<T, U, V, W, X>(
  target: T,
  s: U,
  s1?: V,
  s2?: W,
  s3?: X,
): T & U & V & W & X {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object')
  }
  const to = Object(target)
  for (let index = 1; index < arguments.length; index++) {
    const nextSource = arguments[index]

    if (nextSource != null) {
      for (const nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey]
        }
      }
    }
  }
  return to
}
