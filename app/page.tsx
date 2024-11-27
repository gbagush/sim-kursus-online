"use client";
import axios from "axios";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Input, Textarea } from "@nextui-org/input";
import CourseCard from "@/components/course-card";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CourseForm>({
    title: "",
    instructor: "",
    category: "",
    thumbnail: "",
    video: "",
    description: "",
  });
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);

  const addModal = useDisclosure();

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/course");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get("/api/instructor");
      setInstructors(response.data.data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    try {
      const courseData = {
        ...formData,
        instructor: selectedInstructor?._id,
      };
      await axios.post("/api/course", courseData);
      setFormData({
        title: "",
        instructor: "",
        category: "",
        thumbnail: "",
        video: "",
        description: "",
      });
      setSelectedInstructor(null);
      addModal.onClose();
      fetchCourses();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <Button onPress={addModal.onOpen}>Tambah Kursus</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={{
              _id: course._id,
              title: course.title,
              instructor: `${course.instructor_info?.firstName} ${course.instructor_info?.lastName}`,
              category: course.category,
              thumbnail: course.thumbnail,
            }}
          />
        ))}
      </div>

      <Modal isOpen={addModal.isOpen} onOpenChange={addModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Tambah Kursus</ModalHeader>
              <ModalBody>
                <form>
                  <Input
                    type="text"
                    name="title"
                    label="Judul Kursus"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered" className="mt-4">
                        {selectedInstructor
                          ? `${selectedInstructor.firstName} ${selectedInstructor.lastName}`
                          : "Pilih Instruktur"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Instructor Selection"
                      onAction={(key) => {
                        const instructor = instructors.find(
                          (i) => i._id === key
                        );
                        if (instructor) setSelectedInstructor(instructor);
                      }}
                    >
                      {instructors.map((instructor) => (
                        <DropdownItem key={instructor._id}>
                          {`${instructor.firstName} ${instructor.lastName}`}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Input
                    type="text"
                    name="category"
                    label="Kategori"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                  <Input
                    type="text"
                    name="thumbnail"
                    label="URL Thumbnail"
                    value={formData.thumbnail}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                  <Input
                    type="text"
                    name="video"
                    label="URL Video"
                    value={formData.video}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                  <Textarea
                    type="text"
                    name="description"
                    label="Deskripsi"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button color="primary" onPress={handleAdd}>
                  Tambah
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
