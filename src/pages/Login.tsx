import "../css/login.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {try_login, try_register} from "../tools/api";


function Login() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [note, setNote] = useState("");

    async function login() {
        if (user.length > 3 && password.length) {
            try {
                const res = await try_login(user, password);
                if (res.ok) {
                    localStorage.setItem("brsfreak-pass", password);
                    localStorage.setItem("brsfreak-username", user);
                    window.location.reload();
                } else {
                    console.log(res);
                    if (res.status === 401)
                        setNote("Неверный пароль");
                    else
                        setNote("Произошла ошибка");
                }
            }
            catch (e){
                setNote((e as Error).message);
            }

        }

    }
    async function register() {
        if (user.length > 3 && password.length) {
            try {
                const res = await try_register(user, password);
                if (res.ok) {
                    localStorage.setItem("brsfreak-pass", password);
                    localStorage.setItem("brsfreak-username", user);
                    window.location.reload();
                    // navigate('/');
                } else {
                    console.log(res);
                    if (res.status === 401)
                        setNote("Пользователь существует");
                    else
                        setNote("Произошла ошибка");
                }
            }
            catch (e){
                setNote((e as Error).message);
            }

        }

    }

    return <div>
        <div id={"login-form"}>
            <input placeholder={"Почта урфу"} value={user} onChange={e => setUser(e.target.value)}/>
            <input placeholder={"Пароль"} type={"password"} value={password}
                   onChange={e => setPassword(e.target.value)}/>
            <button onClick={login}>Войти</button>
            <button onClick={register}>Зарегистрироваться</button>
            {note ? <span>{note}</span> : ''}
        </div>
    </div>
}

export default Login;