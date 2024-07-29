import { createContext, useEffect, useContext, useReducer } from "react";

const CitiesContext = createContext();
const URL = "http://localhost:7000/cities";

const initialState = {
  cities: [],
  isloading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "cities/loaded":
      return {
        ...state,
        isloading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isloading: false,
        currentCity: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isloading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isloading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "loading":
      return { ...state, isloading: true };
    case "rejected":
      return { ...state, isloading: false, error: action.payload };
    default:
      throw new Error("Unknown action");
  }
}
function CitiesProvider({ children }) {
  /* const [cities, setCities] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});*/
  const [{ cities, isloading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${URL}`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the cities...",
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === createCity.id) return;
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${URL}/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the city...",
      });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${URL}`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an erro creating city",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${URL}/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an erro deleting city",
      });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isloading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("The context was used outside its provider");
  return context;
}
export { useCities, CitiesProvider };
