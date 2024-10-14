import { useState } from "react";
import PropTypes from 'prop-types';
import api  from "../api";
import LoadingIndicator from "./loader";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/form.css';

function Form({ route, method }) {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const navigate = useNavigate();
    const formName = method === 'login' ? 'Login': 'Register';

    console.log('temp: ', isLoading)
    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault()

        try {
            const res = await api.post(route, {
                username,
                password
            });

            if (method === 'login') {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate('/');
            } else {
                alert('User registered successfully');
                navigate('/login');
            }

        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again. ', error);
        } finally {
            setIsLoading(false);
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{formName}</h1>
        <input
            className="form-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            className="form-input"
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        {isLoading && <LoadingIndicator />}
        <button className="form-button" type="submit">
            {formName}
        </button>
    </form>
}

Form.propTypes = {
    route: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
};

export default Form