import axios from "axios";

export const instance = axios.create({
    baseURL: "http://localhost:8000/"
})

instance.interceptors.request.use((config) => {
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    const authToken = authTokens?.access
    
    const agentTokens = JSON.parse(localStorage.getItem("agentTokens"));
    const agentToken = agentTokens?.access

    const adminTokens  = JSON.parse(localStorage.getItem("adminTokens"));
    const adminToken = adminTokens?.access

    if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken}`;
    } else if (agentToken) {
        config.headers["Authorization"] = `Bearer ${agentToken}`;
    } else if (adminToken) {
        config.headers["Authorization"] = `Bearer ${adminToken}`;
    }

    return config;
})

