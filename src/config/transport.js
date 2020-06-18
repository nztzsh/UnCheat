import Axios from "axios";

const transport = Axios.create({
    withCredentials: true
});

export default transport;