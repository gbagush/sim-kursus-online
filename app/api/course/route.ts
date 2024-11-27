import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { MongoError, ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  const data = await request.json();

  if (
    !data.title ||
    !data.instructor ||
    !data.category ||
    !data.thumbnail ||
    !data.video ||
    !data.description
  ) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }

  try {
    const instructor = await db
      .collection("instructors")
      .findOne({ _id: new ObjectId(data.instructor) });
    if (!instructor) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 }
      );
    }

    const result = await db.collection("courses").insertOne({
      title: data.title,
      instructor: new ObjectId(data.instructor),
      category: data.category,
      thumbnail: data.thumbnail,
      video: data.video,
      description: data.description,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Course Added Successfully", data: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
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
      const course = await db
        .collection("courses")
        .aggregate([
          {
            $match: { _id: new ObjectId(id) },
          },
          {
            $lookup: {
              from: "instructors",
              localField: "instructor",
              foreignField: "_id",
              as: "instructor_info",
            },
          },
          {
            $unwind: {
              path: "$instructor_info",
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .toArray();

      if (!course.length) {
        return NextResponse.json(
          { message: "Course not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(course[0], { status: 200 });
    } else {
      const courses = await db
        .collection("courses")
        .aggregate([
          {
            $lookup: {
              from: "instructors",
              localField: "instructor",
              foreignField: "_id",
              as: "instructor_info",
            },
          },
          {
            $unwind: {
              path: "$instructor_info",
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .toArray();
      return NextResponse.json(courses, { status: 200 });
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

  if (
    !id ||
    !data.title ||
    !data.instructor ||
    !data.category ||
    !data.thumbnail ||
    !data.video ||
    !data.description
  ) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }

  try {
    const instructor = await db
      .collection("instructors")
      .findOne({ _id: new ObjectId(data.instructor) });
    if (!instructor) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 }
      );
    }

    const result = await db.collection("courses").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: data.title,
          instructor: new ObjectId(data.instructor),
          category: data.category,
          thumbnail: data.thumbnail,
          video: data.video,
          description: data.description,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Course updated successfully" },
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
      .collection("courses")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Course deleted successfully" },
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
