const Auth = {
    isAuthenticated: false,
    getAuth() {
        const authToken = localStorage.getItem("authToken")
        if(authToken){
            this.isAuthenticated = true;
        }else{
            this.isAuthenticated = false;
        }
    return this.isAuthenticated;
    }
    };
    export default Auth;