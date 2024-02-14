import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const history = useHistory();

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(url, { email, password })
            localStorage.setItem('token', response.data.token)
            history.push('/profile')
        } catch (error) {
            console.log('login failed');
        }
    }


    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handlesubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                <input type="password" placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login
