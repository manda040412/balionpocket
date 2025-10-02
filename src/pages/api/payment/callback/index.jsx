import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "../../../../components/ui/toaster";

export default function Callback () {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const {toast} = useToast();
    
    useEffect(() => {
        console.log(queryParams.get("successful"))
        if(queryParams.get("message") || queryParams.get("successful")) {
            navigate("/order-list")
        }
    },[]);
    
    return (
        <Toaster />
    );
}