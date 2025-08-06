import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function Callback () {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    
    if(queryParams.get("token")) {
        localStorage.setItem("authToken", queryParams.get("token"));
        navigate('/');
    }
    
    return (
        <p>Okay</p>
    );
}