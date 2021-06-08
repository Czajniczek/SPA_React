import axios from "axios"

export const apiClient = axios.create({
    baseURL: "http://localhost:22955/",
    headers: {
        "Access-Allow-Header-Origin": "*",
        "Access-Allow-Header-Method": "GET,PUT,POST,DELETE"
    },
    withCredentials: false
})