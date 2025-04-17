import { Outlet, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { BASE_URL } from "../utils/constant"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"

import { useEffect, useMemo } from "react"
import Navbar from "./Navbar"
import InvoiceForm from "./InvoceForm"


const Body = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useSelector(state => state.user)
    const fetchUserData = async () => {

        try {
            const userData = await axios.get(BASE_URL + "profile/view", { withCredentials: true })
            dispatch(addUser(userData.data))
            // navigate('/')
        } catch (userErr) {
            if (userErr.response.status === 401) {
                navigate('/login')
            }
            console.error(userErr.message)
        }
    }





    useEffect(() => {
        if (!user) {
            fetchUserData()
        }
    }, [user]) // No dependency required since it's fetching once on mount

    return (
        <>
            <Navbar />
            <Outlet />
            {/* <Footer /> */}

        </>
    )
}

export default Body
