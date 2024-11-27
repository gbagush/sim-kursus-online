import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import Link from "next/link";

export default function CourseCard({
  course,
}: {
  course: {
    _id: string;
    title: string;
    instructor: string;
    category: string;
    thumbnail: string;
  };
}) {
  return (
    <Card as={Link} href={`/kursus/${course._id}`} className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{course.category}</p>
        <small className="text-default-500">{course.instructor}</small>
        <h4 className="font-bold text-large">{course.title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Course Thumbnail"
          className="object-cover rounded-xl"
          src={course.thumbnail}
          width={500}
          height={500}
        />
      </CardBody>
    </Card>
  );
}
