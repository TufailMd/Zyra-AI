import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
function Customize2() {
    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)
    const [assistantName, setAssistantName] = useState(userData?.AssistantName || "")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleUpdateAssistant = async () => {
        setLoading(true)
        try {
            let formData = new FormData()
            formData.append("assistantName", assistantName)
            if (backendImage) {
                formData.append("assistantImage", backendImage)
            } else {
                formData.append("imageUrl", selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
            setLoading(false)
            // console.log(result.data.user)
            setUserData(result.data.user)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    return (
        <div className='w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5 relative '>
            <MdKeyboardBackspace className='absolute top-7.5 left-7.5 text-white cursor-pointer w-6.25 h-6.25' onClick={() => navigate("/customize")} />
            <h1 className='text-white mb-10 text-7.5 text-center '>Enter Your <span className='text-blue-200'>Assistant Name</span> </h1>
            <input type="text" placeholder='eg. shifra' className='w-full max-w-150 h-15 outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]' required onChange={(e) => setAssistantName(e.target.value)} value={assistantName} />
            {assistantName && <button className='min-w-75 h-15 mt-7.5 text-black font-semibold cursor-pointer  bg-white rounded-full text-[19px] ' disabled={loading} onClick={() => {
                handleUpdateAssistant()
            }
            } >{!loading ? "Finally Create Your Assistant" : "Loading..."}</button>}

        </div>
    )
}

export default Customize2