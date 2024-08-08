import { useLoadScript, GoogleMap, Autocomplete } from "@react-google-maps/api"

const libraries = ["places"];

export default function InputLocationAutocomplete(props) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.MAPS_API_KEY,
        libraries: libraries
    });

    const [location, setLocation] = 
}