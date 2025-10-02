import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback () {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(queryParams.get("token")) {
            localStorage.setItem("authToken", queryParams.get("token"));
            navigate("/")
        } else {
            navigate("/login")
        }
    }, [])
    
    return (
        <p>Okay</p>
    );
}