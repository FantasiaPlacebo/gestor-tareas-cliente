import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../index";

interface Project {
  _id: string;
  nombre: string;
  descripcion: string;
  creador: string;
  miembros: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  status: "idle",
  error: null,
};
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (!token) {
      throw new Error("No hay token de autenticacion");
    }

    const config = {
      headers: {
        "x-auth-token": token,
      },
    };

    const response = await axios.get(
      "http://localhost:3000/api/proyectos",
      config
    );
    return response.data as Project[];
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Algo salio mal";
      });
  },
});

export default projectSlice.reducer;
