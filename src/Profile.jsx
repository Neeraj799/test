import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Profile = () => {
    const [userData, setUserData] useState(null);

    useEffect(() => {

    })

    return (
        <div>
            <h2>Profile</h2>
            {userData && (
                <div>
                    <p>Username:  {userData.username}</p>
                    <p>Email:     {userData.email}</p>
                    <div>
      )}
                    </div>
                    )
}

                    export default Profile
