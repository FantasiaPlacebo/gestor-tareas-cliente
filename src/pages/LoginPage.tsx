import { useState, type FormEvent } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/usuarios/login",
        {
          nombreUsuario,
          password,
        }
      );

      const { token } = response.data;
      dispatch(setCredentials(token));

      navigate("/"); // Redirige al dashboard
    } catch (err) {
      console.error("Error en el login:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.mensaje || "Ocurrio un error");
      } else {
        setError("Error de red o el servidor no responde");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="p-8 bg-white shadow-lg rounded-lg w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Iniciar Sesion
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Usuario o Email
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ej. usuario o usuario@correo.com"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Ingresar
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
