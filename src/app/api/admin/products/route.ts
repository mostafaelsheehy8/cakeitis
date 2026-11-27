import { connectDB } from "@/lib/db";
import { parseProduct, slugify } from "@/lib/productInput";
import { bad } from "@/lib/validate";
import { Product } from "@/models/Product";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return bad("Invalid JSON");
  const { data, error } = parseProduct(body);
  if (!data) return bad(error!);

  await connectDB();
  const base = slugify(data.name);
  let slug = base;
  for (let n = 2; await Product.exists({ slug }); n++) slug = `${base}-${n}`;
  const p = await Product.create({ ...data, slug });
  return Response.json({ id: String(p._id) }, { status: 201 });
}
