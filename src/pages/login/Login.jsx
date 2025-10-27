import axios from "axios";
import { useContext, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginimage from "./image/loginimage.png";
import Cookies from "js-cookie";

const Login = ({ onRegisterClick }) => {
  const [credentials, setCredentials] = useState({
    email: "",         // ✅ cambiado de username → email
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error("Usuario o contraseña incorrectos");
    }
  }, [error]);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post(
        "https://magictreavel.onrender.com/api/auth/login",
        credentials
      );

      const token = res.data.token;

      if (token) {
        // ✅ Guardar token y datos del usuario
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.data.details));

        // ✅ Configurar token para futuras peticiones
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });

        toast.success("Sesión iniciada con éxito");
        setTimeout(() => navigate(-1), 2000);
      } else {
        console.error("❌ No se recibió un token válido del backend");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err.response?.data || err);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response?.data || "Error desconocido",
      });
    }
  };

  return (
    <section className="vh-100 login-mdb">
      <ToastContainer autoClose={2000} />
      <div className="container py-5 vh-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card card-mbd">
              <div className="row g-0">
                <div className="col-md-6 col-lg-6 d-none d-md-block">
                  <img className="img-fluid img-mdb" src={loginimage} alt="" />
                </div>
                <div className="col-md-6 col-lg-6 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form>
                      <h5 className="fw-normal headersign mb-3 pb-3">
                        Ingresa con tu cuenta
                      </h5>

                      {/* ✅ Campo de correo */}
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Correo electrónico
                        </label>
                        <input
                          value={credentials.email}
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          onChange={handleChange}
                          placeholder="Ejemplo: usuario@gmail.com"
                        />
                      </div>

                      {/* Campo de contraseña */}
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Contraseña
                        </label>
                        <input
                          value={credentials.password}
                          type="password"
                          className="form-control form-control-lg"
                          id="password"
                          onChange={handleChange}
                          placeholder="Ejemplo: 12345678"
                        />
                      </div>

                      {/* Botón de login */}
                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          disabled={loading}
                          onClick={handleClick}
                          type="button"
                        >
                          {loading && (
                            <div
                              className="spinner-grow me-2 spinner-grow-sm text-light"
                              role="status"
                            >
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          )}
                          Ingresar
                        </button>
                      </div>

                      {/* Enlace a registro */}
                      <div className="registro">
                        <button
                          type="button"
                          className="register-button"
                          onClick={() => navigate("/register")}
                        >
                          Regístrate aquí
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Login;
