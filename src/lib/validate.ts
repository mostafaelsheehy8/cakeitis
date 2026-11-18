export function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
