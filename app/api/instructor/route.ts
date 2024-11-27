import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { MongoError, ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  const data = await request.json();

  if (!data.firstName || !data.lastName || !data.email) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }

  try {
    const result = await db.collection("instructors").insertOne({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });

    return NextResponse.json(
      { message: "Instructor Added Successfully", data: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof MongoError) {
      if (error.code === 11000) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 409 }
        );
      }
    }

    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const instructor = await db
        .collection("instructors")
        .findOne({ _id: new ObjectId(id) });
      if (!instructor) {
        return NextResponse.json(
          { message: "Instructor not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Success getting instructor data", data: instructor },
        { status: 200 }
      );
    } else {
      const instructors = await db.collection("instructors").find().toArray();
      return NextResponse.json(
        { message: "Success getting instructor data", data: instructors },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !data.firstName || !data.lastName || !data.email) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }

  try {
    const result = await db.collection("instructors").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Instructor updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }

  try {
    const result = await db
      .collection("instructors")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Instructor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
