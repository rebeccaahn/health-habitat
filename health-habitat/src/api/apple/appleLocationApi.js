import { getAppleLocation } from "./prodData";
import { getDummyLocation } from "./dummyData";

// Change prod in the healthkit file
import { isProd } from "./appleHealthApi";


const getLocation = async () => {
    if (isProd) {
        try {
            let response = await getAppleLocation();
            console.log("location is", response);
            return response;
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
    } else {
        return getDummyLocation();
    }
}
  

export { getLocation };
