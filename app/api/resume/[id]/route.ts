import { NextResponse } from "next/server";
import clientPromise from "@/utils/dbConnect";
import { ObjectId } from "mongodb";

// DELETE resume
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("AI-HR");
    const collection = db.collection("resume");
    const result = await collection.deleteOne({ _id: new ObjectId(params.id) });
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Deleted" });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// PATCH resume (update status)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const client = await clientPromise;
    const db = client.db("AI-HR");
    const collection = db.collection("resume");
    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status } }
    );
    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Updated" });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
