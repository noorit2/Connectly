import { create } from 'zustand'
import { devtools, persist  } from 'zustand/middleware';
const useAuthStore = create(devtools(persist((set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => { 
    set({ user:{...user}, isAuthenticated: true });
},
    logout: () => set({ user: null, isAuthenticated: false })
}),{name:"store"})));

export default useAuthStore;