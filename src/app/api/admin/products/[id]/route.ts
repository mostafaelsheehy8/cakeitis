import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { parseProduct } from "@/lib/productInput";
import { bad } from "@/lib/validate";
import { Product } from "@/models/Product";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!isValidObjectId(id)) return bad("Invalid id");
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return bad("Invalid JSON");

  await connectDB();
  // Quick show/hide toggle from the list
  if (Object.keys(body).length === 1 && typeof body.available === "boolean") {
    const p = await Product.findByIdAndUpdate(id, { available: body.available }, { new: true });
    if (!p) return bad("Product not found", 404);
    return Response.json({ ok: true });
  }

  const { data, error } = parseProduct(body);
  if (!data) return bad(error!);
  const p = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!p) return bad("Product not found", 404);
  return Response.json({ ok: true });
}

// Old orders keep their own copy of the name and price, so deleting a product doesn't break them.
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!isValidObjectId(id)) return bad("Invalid id");
  await connectDB();
  const p = await Product.findByIdAndDelete(id);
  if (!p) return bad("Product not found", 404);
  return Response.json({ ok: true });
}
