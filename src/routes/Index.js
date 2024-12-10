import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FormDataTable  from '../pages/FormDataTable'

const router = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<FormDataTable />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default router