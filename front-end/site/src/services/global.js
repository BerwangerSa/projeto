import Axios from "axios";
import mitt from 'mitt'
import router from ".././router";

export const emitter = mitt()


export const httpRequest = Axios.create({
    baseURL: 'https://localhost:7153',
    
})



export const getCookie = function (cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


export const setCookie = function (cname, cvalue, exdays) {
    let expires = "expires=" + new Date(exdays).toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";";
}


export const isLogged = function () {
    return getCookie("login") != "" && getCookie("token") != "";
}

export const isAdmin = function () {
    return getCookie("isAdmin") != "" && getCookie("isAdmin") == "true";
}

export const logar = function (login, isAdmin, token, dtExpiracao) {
    setCookie(
        "login",
        login,
        dtExpiracao
    );

    setCookie(
        "isAdmin",
        isAdmin,
        dtExpiracao
    );
    setCookie(
        "token",
        token,
        dtExpiracao
    );


}

export const deslogar = function () {
    setCookie("login", "", new Date());
    setCookie("token", "", new Date());
    setCookie("isAdmin", "", new Date());

}


httpRequest.interceptors.response.use(
    function (success) {
        return success;
    },
    function (error) {
        if (error.response.status == 401 || error.response.data.message == '401 Unauthorized') {
            router.push('/');
            deslogar();
        }

    }
);