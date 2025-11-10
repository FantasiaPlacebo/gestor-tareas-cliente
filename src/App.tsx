import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "./store/slices/authSlice";
import { fetchProjects } from "./store/slices/projectSlice";
import type { RootState, AppDispatch } from "./store";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { projects, status, error } = useSelector(
    (state: RootState) => state.projects
  );

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  let content;
  if (status === "loading") {
    content = <p>Cargando proyectos...</p>;
  } else if (status === "succeeded") {
    content = (
      <ul>
        {projects.length === 0 ? (
          <li>No tienes proyectos aun.</li>
        ) : (
          projects.map((project) => (
            <li key={project._id} className="border-b py-2">
              {project.nombre}
            </li>
          ))
        )}
      </ul>
    );
  } else if (status === "failed") {
    content = <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Barra de Navegacion */}
      <header className="bg-white shadow-md w-full">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            Gestor de Tareas
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar Sesion
          </button>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Mis Proyectos</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">{content}</div>
      </main>
    </div>
  );
}

export default App;
