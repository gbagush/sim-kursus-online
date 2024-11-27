"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import { User } from "@nextui-org/user";
import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { useRouter } from "next/navigation";

export default function CoursePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    thumbnail: "",
    video: "",
    description: "",
  });

  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  useEffect(() => {
    const getCourseData = async () => {
      try {
        const response = await axios.get(`/api/course?id=${id}`);
        setCourse(response.data);
        setFormData({
          title: response.data.title,
          category: response.data.category,
          thumbnail: response.data.thumbnail,
          video: response.data.video,
          description: response.data.description,
        });
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    getCourseData();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async () => {
    try {
      await axios.put(`/api/course?id=${id}`, {
        ...formData,
        instructor: course?.instructor,
      });
      editModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/course?id=${id}`);
      router.push("/");
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Kursus tidak ditemukan</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <div className="flex justify-end gap-4">
        <Button onPress={editModal.onOpen}>Edit</Button>
        <Button color="danger" onPress={deleteModal.onOpen}>
          Hapus
        </Button>
      </div>
      <div className="aspect-video w-full">
        <ReactPlayer url={course.video} width="100%" height="100%" controls />
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{course.title}</h1>
        <User
          name={`${course.instructor_info.firstName} ${course.instructor_info.lastName}`}
          description={course.instructor_info.email}
          avatarProps={{
            src: `https://api.dicebear.com/9.x/initials/svg?seed=${course.instructor_info.firstName} ${course.instructor_info.lastName}`,
          }}
        />
        <br />
        <Chip color="primary">{course.category}</Chip>
        <p>{course.description}</p>
      </div>

      <Modal isOpen={editModal.isOpen} onOpenChange={editModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Kursus</ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  name="title"
                  label="Judul"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-4"
                />
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
                  name="description"
                  label="Deskripsi"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-4"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button color="primary" onPress={handleEdit}>
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Hapus Kursus</ModalHeader>
              <ModalBody>
                Apakah anda yakin ingin menghapus kursus ini?
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button color="danger" onPress={handleDelete}>
                  Hapus
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
