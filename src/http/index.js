import axios from 'axios'
// import URL from '../config/env'

export default async ({
    method = "",
    url = "",
    headers = {},
    data = {},
    params = {}
}) => {
    const options = {
        method,
        url,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            ...headers
        },
        data,
        params
    }
    return await axios(options).then(result => result).catch(err => {
        if (err && err.response &&  err.response) {
            return err.response
        }
        return null;
    })
}