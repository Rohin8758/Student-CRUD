import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { motion } from "framer-motion";
import StudentForm from "../components/RegistrationForm/StudentForm";
import { IoMdClose } from "react-icons/io";
import Details from "../components/StudentDetails/Details";

const FormDataTable = () => {
    const [formDataArray, setFormDataArray] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 5;
    const storedData = JSON.parse(localStorage.getItem("formData")) || [];
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);

    const handleAddStudent = () => {
        setSelectedStudent(null);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setIsDetailsPopupOpen(false);
    };

    const handleFormSubmit = () => {
        closePopup();
        window.location.reload();
    };

    const handleEditStudent = (studentData) => {
        setSelectedStudent(studentData);
        setIsPopupOpen(true);
    };

    useEffect(() => {
        if (storedData) {
            setFormDataArray(storedData);
        }
    }, []);

    const handleDelete = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this data?");
        if (isConfirmed) {
            const updatedData = formDataArray.filter((student) => student.id !== id);
            setFormDataArray(updatedData);
            localStorage.setItem("formData", JSON.stringify(updatedData));
        }
    };

    const handleViewDetails = (studentData) => {
        setSelectedStudent(studentData);
        setIsDetailsPopupOpen(true);
    };

    const filteredData = formDataArray.filter((data) => {
        const normalizedQuery = searchQuery.trim().replace(/\s+/g, " ").toLowerCase();
        const normalizedFirstName = data.firstName.trim().replace(/\s+/g, " ").toLowerCase();
        const normalizedLastName = data.lastName.trim().replace(/\s+/g, " ").toLowerCase();
        const normalizedEmail = data.email.trim().replace(/\s+/g, " ").toLowerCase();
        const normalizedPhone = data.phone.toString().trim().replace(/\s+/g, " ").toLowerCase();

        return (
            `${normalizedFirstName} ${normalizedLastName}`.includes(normalizedQuery) ||
            normalizedEmail.includes(normalizedQuery) ||
            normalizedPhone.includes(normalizedQuery)
        );
    });

    const totalPages = Math.ceil(filteredData.length / studentsPerPage);
    const currentPageData = filteredData.slice(
        (currentPage - 1) * studentsPerPage,
        currentPage * studentsPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="h-screen overflow-y-auto flex items-center justify-center bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full bg-white p-8 rounded-xl shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Students Table Data</h1>
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center mb-5 gap-4 sm:gap-0">
                        <div className="w-full sm:w-[30%] relative">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border border-gray-400 px-4 py-2 rounded-3xl focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <IoSearch className="absolute top-2 right-3 text-2xl text-gray-500" />
                        </div>
                        <div className="grid w-full justify-end">
                            <button className="px-3 py-2 bg-gray-800 text-white md:text-lg text-sm rounded-xl" onClick={handleAddStudent}>
                                Add Student
                            </button>
                        </div>
                    </div>

                    {isPopupOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-5 z-50">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white pt-3 pb-7 md:px-10 px-4 rounded-xl shadow-lg w-full sm:w-[900px] lg:h-[820px] md:h-[720px] h-[620px] overflow-auto"
                            >
                                <div className="grid w-full justify-end items-center">
                                    <IoMdClose className="mt-5 text-2xl" onClick={closePopup} />
                                </div>
                                <StudentForm
                                    onFormSubmit={handleFormSubmit}
                                    studentData={selectedStudent || {}}
                                />
                            </motion.div>
                        </div>
                    )}

                    {isDetailsPopupOpen && selectedStudent && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-5">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white pt-3 pb-7 px-10 rounded-xl shadow-lg w-full sm:w-[900px] lg:h-[820px] md:h-[720px] h-[620px] overflow-auto"
                            >
                                <div className="grid w-full justify-end items-center">
                                    <IoMdClose className="mt-5 text-2xl" onClick={closePopup} />
                                </div>
                                <Details student={selectedStudent} />
                            </motion.div>
                        </div>
                    )}

                    {currentPageData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse border-y rounded-xl border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border-b border-gray-500 px-4 py-2">Id</th>
                                        <th className="border-b border-gray-500 px-4 py-2">Profile</th>
                                        <th className="border-b border-gray-500 px-4 py-2">First Name</th>
                                        <th className="border-b border-gray-500 px-4 py-2">Last Name</th>
                                        <th className="border-b border-gray-500 px-4 py-2">Email</th>
                                        <th className="border-b border-gray-500 px-4 py-2">Phone</th>
                                        <th className="border-b border-gray-500 px-4 py-2">DOB</th>
                                        <th className="border-b border-gray-500 px-4 py-2">Division</th>
                                        <th className="border-b border-gray-500 px-4 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPageData.map((data, index) => (
                                        <tr key={index} className="text-center">
                                            <td className="border-b-2 border-gray-300 px-4 py-2">{data.id}</td>
                                            <td className="border-b-2 border-gray-300 grid justify-center items-center px-4 py-2">
                                                {data.profilePicture ? (
                                                    <img
                                                        src={data.profilePicture}
                                                        alt="Profile"
                                                        className="h-12 w-12 rounded-full border object-cover"
                                                    />
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                            <td className="border-b-2 border-gray-300 px-4 py-2">{data.firstName}</td>
                                            <td className="border-b-2 border-gray-300 px-4 py-2">{data.lastName}</td>
                                            <td className="border-b-2 border-gray-300 px-4 py-2">{data.email}</td>
                                            <td className="border-b-2 border-gray-300 px-4 py-2">{data.phone}</td>
                                            <td className="border-b-2 border-gray-300 px-4 py-2">{data.dob}</td>
                                            <td className="border-b-2 border-gray-300 px-4 py-2">{data.division}</td>
                                            <td className="border-b-2 border-gray-300 px-4 py-2">
                                                <div className="flex justify-center items-center gap-3">
                                                    <FaRegEdit className="text-2xl hover:cursor-pointer text-blue-700" onClick={() => handleEditStudent(data)} />
                                                    <MdDelete className="text-2xl hover:cursor-pointer text-red-500" onClick={() => handleDelete(data.id)} />
                                                    <IoEyeSharp className="text-2xl hover:cursor-pointer text-gray-700" onClick={() => handleViewDetails(data)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No data available</p>
                    )}

                    <div className="flex justify-end items-center mt-4 gap-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 rounded-lg disabled:bg-gray-200"
                        >
                            Prev
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 rounded-lg disabled:bg-gray-200"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default FormDataTable;
