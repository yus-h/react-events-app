// TODO refactor app to use axios
import axios from 'axios';

export default axios.create({
    baseURL:  'http://localhost:8080'
});
