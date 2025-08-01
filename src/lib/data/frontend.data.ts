import { getData } from "../useAxios"

export const fetchTourPackageData = async () => {
    const data = await getData("frontend/tour-packages");
    
    console.log(data);
}