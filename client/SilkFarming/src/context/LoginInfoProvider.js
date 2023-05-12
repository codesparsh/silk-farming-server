import React, { createContext, useState } from 'react';

const userInfoObj = {
    username: "",
    password: "",
    tiers: "",
    species: "",
    shedDimensions: "",
    state: "",
    sanitation: ""
}
export const LoginContext = createContext(userInfoObj);

export default function LoginInfoProvider({ children }) {
    const [userInfo, setUserInfo] = useState(userInfoObj);

    const updateUserInfo = (newInfo) => {
        setUserInfo((prevInfo) => ({ ...prevInfo, ...newInfo }));
    };

    return (
        <LoginContext.Provider value={{ userInfo, updateUserInfo }}>
            {children}
        </LoginContext.Provider>
    );
}
