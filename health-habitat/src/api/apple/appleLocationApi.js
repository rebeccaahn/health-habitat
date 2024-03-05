import { getAppleLocation } from "./prodData";
import { getDummyLocation } from "./dummyData";

// Change prod in the healthkit file
import { isProd } from "./appleHealthApi";


const getLocation = async () => {
    if (isProd) {
        try {
            return await getAppleLocation();
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
    } else {
        return getDummyLocation();
    }
}
  

export { getLocation };
