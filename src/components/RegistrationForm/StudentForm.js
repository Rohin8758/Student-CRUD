import React, { useState } from "react";
import { IoCameraSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { useFormik } from "formik";
import * as Yup from "yup";

const StudentForm = ({ onFormSubmit, studentData }) => {

    const [showPassword, setShowPassword] = useState(false);
    const storedStudents = JSON.parse(localStorage.getItem("formData")) || [];

    const initialValues = {
        id: studentData.id || '',
        firstName: studentData.firstName || "",
        lastName: studentData.lastName || "",
        email: studentData.email || "",
        phone: studentData.phone || "",
        password: studentData.password || "",
        dob: studentData.dob || "",
        hobbies: studentData.hobbies || "",
        gender: studentData.gender || "",
        division: studentData.division || "",
        profilePicture: studentData.profilePicture || "",
    }

    const validationSchema = Yup.object({
        firstName: Yup.string()
            .trim("First name cannot include leading or trailing spaces")
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name cannot exceed 50 characters")
            .required("First name is required"),
        lastName: Yup.string()
            .trim("Last name cannot include leading or trailing spaces")
            .min(2, "Last name must be at least 2 characters")
            .max(50, "Last name cannot exceed 50 characters")
            .required("Last name is required"),
        email: Yup.string()
            .trim("Email cannot include leading or trailing spaces")
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Invalid email format"
            )
            .matches(
                /^(?![_.])([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/,
                "Email cannot start with special characters like _ or ."
            )
            .required("Email is required")
            .test("unique-email", "This email is already in use.", function (value) {
                return !storedStudents.some(
                    (student) => student.email === value && student.id !== studentData.id
                );
            }),
        phone: Yup.string()
            .trim("Phone number cannot include leading or trailing spaces")
            .matches(/^\d{10}$/, "Phone number must be 10 digits")
            .required("Phone number is required")
            .test("unique-phone", "This phone number is already in use.", function (value) {
                return !storedStudents.some(
                    (student) => student.phone === value && student.id !== studentData.id
                );
            }),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Password must include one uppercase, one lowercase, one digit, and one special character"
            )
            .required("Password is required"),
        dob: Yup.date().required("Date of birth is required"),
        gender: Yup.string().required("Gender is required"),
        hobbies: Yup.array().min(1, "Select at least one hobby"),
        division: Yup.string().required("Division is required"),
        profilePicture: Yup.string()
            .required("Profile picture is required")
            .test(
                "is-valid-picture",
                "Invalid profile picture format",
                (value) => {
                    return value.startsWith("data:image/") || value === "";
                }
            ),
    });

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            formik.setFieldValue("hobbies", [...formik.values.hobbies, value]);
        } else {
            formik.setFieldValue(
                "hobbies",
                formik.values.hobbies.filter((hobby) => hobby !== value)
            );
        }
    };

    const handleProfilePictureChange = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64String = reader.result;
                    formik.setFieldValue("profilePicture", base64String);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const onSubmit = (values) => {
        const storedData = JSON.parse(localStorage.getItem("formData")) || [];
        if (studentData.id) {
            const updatedData = storedData.map((student) =>
                student.id === studentData.id ? { ...values, id: student.id } : student
            );
            localStorage.setItem("formData", JSON.stringify(updatedData));
        } else {
            const newId = storedData.length > 0
                ? Math.max(...storedData.map((student) => student.id)) + 1
                : 1;
            const newData = { ...values, id: newId };

            localStorage.setItem("formData", JSON.stringify([...storedData, newData]));
        }
        onFormSubmit();
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    const handleCancel = () => {
        formik.resetForm();
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <h1 className="text-xl font-bold text-center mb-3">Registration Form</h1>

            <div className="grid justify-center mb-5 text-center">
                <div className="relative w-28 mx-auto">
                    {formik.values.profilePicture ? (
                        <div className="mb-5 flex justify-center">
                            <img
                                src={formik.values.profilePicture}
                                alt="Profile Preview"
                                className="md:w-28 w-20 md:h-28 h-20 ml-3 rounded-full border object-cover"
                            />
                        </div>
                    ) : (
                        <div className="mb-5 flex justify-center">
                            <img
                                src={require("../../assets/blank-profile-picture-973460_640.jpg")}
                                className="md:w-28 w-20 md:h-28 h-20 ml-3 rounded-full border object-cover"
                                alt=""
                            />
                        </div>
                    )}
                    <div className="absolute bottom-5 right-0">
                        <IoCameraSharp className="text-2xl" onClick={handleProfilePictureChange} />
                    </div>
                </div>
                {formik.touched.profilePicture && formik.errors.profilePicture && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.profilePicture}</p>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-5 items-center">
                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        placeholder="First Name"
                        className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
                    )}
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        placeholder="Last Name"
                        className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 items-center">
                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        placeholder="Email"
                        className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                    )}
                </div>

                <div className="mb-5 relative">
                    <label className="block text-gray-700 font-medium mb-2">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            placeholder="Password"
                            className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <IoEyeSharp className="text-gray-500 text-xl" />
                            ) : (
                                <FaEyeSlash className="text-gray-500 text-xl" />
                            )}
                        </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                    )}
                </div>
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                <input
                    type="date"
                    name="dob"
                    value={formik.values.dob}
                    onChange={formik.handleChange}
                    className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {formik.touched.dob && formik.errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.dob}</p>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-5 items-center">
                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        placeholder="Phone Number"
                        className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                    )}
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Division</label>
                    <select
                        name="division"
                        value={formik.values.division}
                        onChange={formik.handleChange}
                        className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <option value="">Select Division</option>
                        <option value="A">Division A</option>
                        <option value="B">Division B</option>
                        <option value="C">Division C</option>
                    </select>
                    {formik.touched.division && formik.errors.division && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.division}</p>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 items-center">
                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Gender</label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formik.values.gender === "male"}
                                onChange={formik.handleChange}
                                className="mr-2 w-5 h-5"
                            />
                            Male
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formik.values.gender === "female"}
                                onChange={formik.handleChange}
                                className="mr-2 w-5 h-5"
                            />
                            Female
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="other"
                                checked={formik.values.gender === "other"}
                                onChange={formik.handleChange}
                                className="mr-2 w-5 h-5"
                            />
                            Other
                        </label>
                    </div>
                    {formik.touched.gender && formik.errors.gender && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
                    )}
                </div>
                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Hobbies</label>
                    <div className="flex flex-wrap gap-4">
                        {["Reading", "Gaming", "Sports", "Traveling"].map((hobby) => (
                            <label key={hobby} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={hobby}
                                    checked={formik.values.hobbies.includes(hobby)}
                                    onChange={(e) => handleCheckboxChange(e)}
                                    className="mr-2 w-5 h-5"
                                />
                                {hobby}
                            </label>
                        ))}
                    </div>
                    {formik.touched.hobbies && formik.errors.hobbies && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.hobbies}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-10">
                {studentData.id ? "" : (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {studentData.id ? "Update" : "Submit"}
                </button>
            </div>
        </form>

    );
};

export default StudentForm;
