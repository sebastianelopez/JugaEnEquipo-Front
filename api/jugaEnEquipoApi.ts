import axios from "axios";

const jugaEnEquipoApi= axios.create({
    baseURL: '/api'
})

export default jugaEnEquipoApi;