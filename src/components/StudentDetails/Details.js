import React from "react";

const Details = ({ student }) => {

    if (!student) {
        return <p className="text-center mt-8">Loading student details...</p>;
    }

    return (
        <form
            className=""
        >
            <div className="text-center mb-5 mt-3">
                <h1 className="text-2xl font-bold">Student Details</h1>
            </div>
            <div className="grid justify-center mb-5 text-center">
                <div className="relative w-36 mx-auto">
                    {student.profilePicture ? (
                        <div className="mb-5 flex justify-center">
                            <img
                                src={student.profilePicture}
                                alt="Profile Preview"
                                className="md:w-40 w-28 md:h-36 h-28 ml-3 rounded-full border object-cover"
                            />
                        </div>
                    ) : (
                        <div className="mb-5 flex justify-center">
                            <img src={require("../../assets/blank-profile-picture-973460_640.jpg")} className="w-100 h-100 ml-3 rounded-full border object-cover" alt="" />
                        </div>

                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-5 items-center">
                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">First Name</label>
                    <h4 className="font-bold underline underline-offset-4">{student.firstName}</h4>

                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                    <h4 className="font-bold underline underline-offset-4">{student.lastName}</h4>

                </div>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-5 items-center">
                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <h4 className="font-bold underline underline-offset-4">{student.email}</h4>
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                    <h4 className="font-bold underline underline-offset-4">{student.phone}</h4>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5 items-center">
                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Gender</label>
                    <div className="flex items-center gap-4">
                        <h4 className="font-bold underline underline-offset-4">{student.gender}</h4>
                    </div>
                </div>
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                <h4 className="font-bold underline underline-offset-4">{student.dob}</h4>
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">Hobbies</label>
                <div className="flex flex-wrap gap-4">
                    <h4 className="font-bold">
                        {Array.isArray(student.hobbies)
                            ? student.hobbies.join(", ")
                            : student.hobbies}
                    </h4>
                </div>
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">Division</label>
                <h4 className="font-bold underline underline-offset-4">{student.division}</h4>
            </div>
        </form>
    );
};

export default Details;
