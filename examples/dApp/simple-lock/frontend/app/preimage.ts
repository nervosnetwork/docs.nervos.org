export function stringToBytesHex(text: string): `0x${string}` {
  return `0x${Array.from(new TextEncoder().encode(text), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("")}`;
}
