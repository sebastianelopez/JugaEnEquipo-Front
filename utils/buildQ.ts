type QParams = {
  offset?: number;
  limit?: number;
  [key: string]: string | number | undefined;
};

export function buildQ(params: QParams = {}): string | undefined {
  const parts: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value !== "undefined" && value !== null && value !== "") {
      parts.push(`${key}:${value}`);
    }
  });
  return parts.length > 0 ? parts.join(";") : undefined;
}
