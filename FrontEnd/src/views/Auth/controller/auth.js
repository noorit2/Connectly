import { redirect } from 'react-router-dom';
import { signIn, signUp } from '../model/auth';
import useAuthStore from '../../../store/auth';

export async function handleUserAuthAction({ request }) {
    const data = await request.formData();
    const formType = data.get('formType'); // Determine which form was submitted

    if (formType === 'register') {
        const user = {
            email: data.get('email'),
            username: data.get('username'),
            password: data.get('password'),
        };

        // Perform registration logic here

        if (!user.email || !user.username || !user.password) {
            return { error: "All fields are required for registration", user, type:"Register" };
        }
        try{    
            const response = await signUp(user.username,user.email,user.password);
            if (response.status !== 201) { // Check for successful status code
                console.log(response.data);
                throw new Error(response.data.error || 'Unknown error occurred');
            } else {
                useAuthStore.getState().login(response.data.data);
                return redirect('/'); // Redirect on successful registration
            }
        }catch(err){
            console.log(err);
            if(err.status === 500){
                throw new Error(err);
            }
            return { error: err.message, user, type:"Register" };
        }
    }

    if (formType === 'signIn') {
        const credentials = {
            email: data.get('email'),
            password: data.get('password'),
        };

        // Perform sign-in logic here

        if (!credentials.email || !credentials.password) {
            return { error: "Email and password are required for sign-in", credentials, type:"Login" };
        }
        try{    
            const response = await signIn(credentials.email,credentials.password);
            if (response.status !== 201) { // Check for successful status code
                console.log(response.data);
                throw new Error(response.data.error || 'Unknown error occurred');
            } else {
                console.log(response.data.user);
                await useAuthStore.getState().login(response.data.user);
                return redirect('/'); // Redirect on successful registration
            }
        }catch(err){
            console.log(err);
            if(err.status === 500){
                throw new Error(err);
            }
            return { error: err.message, credentials, type:"Login" };
        }
        // Assume successful sign-in
    }

    return { error: "Invalid form submission" };
}
