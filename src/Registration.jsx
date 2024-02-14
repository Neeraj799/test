import React, { useState } from 'react'
import axios from 'axios';

const Registration = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('url', { username, email, password });
            history.push('/');
        } catch (err) {
            console.log("registratin failrd");
        }
    }

    return (
        <div>
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} />
                <input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder='Password' value={password} onChange={e => setpassword(e.target.value)} />
                <button type='submit'>Register</button>


            </form>
        </div>
    )
}

export default Registration
