import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

const mockMerch = [
  { id: "m-1", name: "Tour T-Shirt (Black)", category: "Apparel", price: 30, quantity: 150, sold: 87, sku: "TS-BLK-001" },
  { id: "m-2", name: "Tour T-Shirt (White)", category: "Apparel", price: 30, quantity: 100, sold: 62, sku: "TS-WHT-001" },
  { id: "m-3", name: "Vinyl LP — 'Midnight Drive'", category: "Music", price: 28, quantity: 200, sold: 145, sku: "VNL-MD-001" },
  { id: "m-4", name: "Signed Poster (18x24)", category: "Prints", price: 15, quantity: 75, sold: 34, sku: "PTR-SGN-001" },
  { id: "m-5", name: "Enamel Pin Set", category: "Accessories", price: 12, quantity: 300, sold: 198, sku: "PIN-SET-001" },
  { id: "m-6", name: "Tote Bag", category: "Accessories", price: 18, quantity: 120, sold: 56, sku: "BAG-TOT-001" },
  { id: "m-7", name: "Hoodie (Limited Edition)", category: "Apparel", price: 55, quantity: 50, sold: 48, sku: "HD-LTD-001" },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalValue = mockMerch.reduce((s, m) => s + m.price * m.quantity, 0);
    const totalSold = mockMerch.reduce((s, m) => s + m.sold, 0);
    const totalRevenue = mockMerch.reduce((s, m) => s + m.price * m.sold, 0);

    return NextResponse.json({
      merch: mockMerch,
      stats: { totalItems: mockMerch.length, totalValue, totalSold, totalRevenue },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch merch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const newItem = {
      id: `m-${Date.now()}`,
      name: body.name,
      category: body.category || "Other",
      price: body.price || 0,
      quantity: body.quantity || 0,
      sold: 0,
      sku: body.sku || `SKU-${Date.now()}`,
    };

    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add merch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
