import axios from 'axios'
// import URL from '../config/env'

export default (() =>
    axios.create({
        // baseURL: env.API_HOST,
        headers: {
            // common: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
            // }
        }
    }))()