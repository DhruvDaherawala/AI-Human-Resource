import { NextResponse } from "next/server";
import Resume from "@/models/Resume";
import connectDB from "@/lib/mongodb";

// DELETE resume
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const result = await Resume.findByIdAndDelete(params.id);
    
    if (result) {
      return NextResponse.json({ message: "Deleted" });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// PATCH resume (update status)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { status } = await req.json();
    
    const result = await Resume.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    
    if (result) {
      return NextResponse.json({ message: "Updated" });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
