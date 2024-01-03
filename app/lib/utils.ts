export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}

export function chatHrefConstructor(
  id1: string | undefined,
  id2: string | undefined
) {
  if (id1 === undefined || id2 === undefined) {
    return;
  }
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}
