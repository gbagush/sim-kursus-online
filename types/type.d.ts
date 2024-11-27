interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface InstructorForm {
  firstName: string;
  lastName: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  instructor: string;
  instructor_info: Instructor;
  category: string;
  thumbnail: string;
  video: string;
  description: string;
}

interface CourseForm {
  title: string;
  instructor: string;
  category: string;
  thumbnail: string;
  video: string;
  description: string;
}
