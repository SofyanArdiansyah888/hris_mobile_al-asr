/* eslint-disable react-hooks/exhaustive-deps */
import {UserEntity} from "../models/User.entity";
import {createContext, useContext, useMemo} from "react";
import {useHistory} from "react-router-dom";
import {useLocalStorage} from "../hooks/useLocalStorage";
import usePesantrenLocationStore from "../store/usePesantrenLocationStore";

const AuthContext = createContext<IValue>({
    user: null,
    login: null,
    logout: null,
});

interface IAuthProvider {
    children: JSX.Element;
}

interface IValue {
    user: UserEntity | unknown;
    login: any;
    logout: any;
}

export const AuthProvider = ({children}: IAuthProvider) => {
    const [user, setUser] = useLocalStorage("user", null);
    const {setLocation} = usePesantrenLocationStore()
    const history = useHistory();

    const login = async (data: UserEntity) => {
        setLocation({
            latitude: data.setting.latitude,
            longitude: data.setting.longitude,
            radius: data.setting.radius
        })
        setUser(data);
        if (history) history.replace("/beranda");
    };

    // call this function to sign out logged in user
    const logout = () => {
        setUser(null);
        if (history) history.replace("/");
    };

    const value: IValue = useMemo(
        () => ({
            user,
            login,
            logout,
        }),
        [login, logout, user]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
