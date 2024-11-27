"use client";
import axios from "axios";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { User } from "@nextui-org/user";
import { Input } from "@nextui-org/input";

export default function Home() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<InstructorForm>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");

  const addModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const fetchInstructors = async () => {
    try {
      const response = await axios.get("/api/instructor");
      setInstructors(response.data.data);
    } catch (error) {
      console.error("Error fetching instructor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      await axios.post("/api/instructor", formData);
      resetAndRefresh(addModal.onClose);
    } catch (error) {
      console.error("Error adding instructor:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`/api/instructor?id=${selectedInstructor}`, formData);
      resetAndRefresh(editModal.onClose);
    } catch (error) {
      console.error("Error editing instructor:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/instructor?id=${selectedInstructor}`);
      resetAndRefresh(deleteModal.onClose);
    } catch (error) {
      console.error("Error deleting instructor:", error);
    }
  };

  const resetAndRefresh = (closeModal: () => void) => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
    });
    setSelectedInstructor("");
    closeModal();
    fetchInstructors();
  };

  const openEditModal = (instructor: Instructor) => {
    setSelectedInstructor(instructor._id);
    setFormData({
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      email: instructor.email,
    });
    editModal.onOpen();
  };

  const openDeleteModal = (instructorId: string) => {
    setSelectedInstructor(instructorId);
    deleteModal.onOpen();
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <Button onPress={addModal.onOpen}>Tambah Instruktur</Button>
      <Table aria-label="Instructor table">
        <TableHeader>
          <TableColumn>PROFIL</TableColumn>
          <TableColumn>AKSI</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={loading ? "Loading..." : "No rows to display."}
        >
          {instructors.map((instructor) => (
            <TableRow key={instructor._id}>
              <TableCell>
                <User
                  name={`${instructor.firstName} ${instructor.lastName}`}
                  description={instructor.email}
                  avatarProps={{
                    src: `https://api.dicebear.com/9.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`,
                  }}
                />
              </TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={() => openEditModal(instructor)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => openDeleteModal(instructor._id)}
                >
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Modal */}
      <Modal isOpen={addModal.isOpen} onOpenChange={addModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Tambah Instruktur</ModalHeader>
              <ModalBody>
                <form>
                  <Input
                    type="text"
                    name="firstName"
                    label="Nama Depan"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                  <Input
                    type="text"
                    name="lastName"
                    label="Nama Belakang"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    value={formData.email}
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

      {/* Edit Modal */}
      <Modal isOpen={editModal.isOpen} onOpenChange={editModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Instruktur</ModalHeader>
              <ModalBody>
                <form>
                  <Input
                    type="text"
                    name="firstName"
                    label="Nama Depan"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                  <Input
                    type="text"
                    name="lastName"
                    label="Nama Belakang"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                </form>
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

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Hapus Instruktur</ModalHeader>
              <ModalBody>
                Apakah anda yakin ingin menghapus instruktur ini?
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
    </section>
  );
}
