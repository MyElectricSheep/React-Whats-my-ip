import React, { useState, useEffect } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";

// Semantic UI imports
import { Image } from "semantic-ui-react";

// Custom components imports
import UserMap from "./UserMap";
import InfoCard from "./InfoCard";
import Spinner from "./Spinner";

// Assets imports
import IpLogo from "./ip-logo.png";

// Styles imports
import "./styles.css";
import "semantic-ui-css/semantic.min.css";

const App = () => {
  const bermudaTriangleLocation = [27.380863, -71.18844];
  const [location, setLocation] = useState({});
  const [coordinates, setCoordinates] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { REACT_APP_IPIFY_API_KEY } = process.env;

  // Option 1: the then chain
  // Chain multiple thens together (on the same level, no callback style imbrication)
  // And make the data flow down the then chain
  // Don't forget to return from your then if you want the data to be available further down!
  // https://javascript.info/promise-chaining
  // https://nodejs.dev/learn/understanding-javascript-promises
  //   useEffect(() => {
  //     let ipify;
  //     setIsLoading(true);
  //     axios
  //       .get(`https://geo.ipify.org/api/v1?apiKey=${REACT_APP_IPIFY_API_KEY}`)
  //       .then(({ data: ipifyData }) => {
  //         ipify = ipifyData;
  //         return axios.get(
  //           `https://restcountries.eu/rest/v2/alpha/${ipifyData.location.country}`
  //         );
  //       })
  //       .then(({ data: restCountriesData }) => {
  //         setLocation({
  //           ip: ipify.ip,
  //           lat: ipify.location.lat,
  //           lng: ipify.location.lng,
  //           country: restCountriesData.name,
  //           region: ipify.location.region,
  //           city: ipify.location.city,
  //           timezone: ipify.location.timezone,
  //           countryData: restCountriesData,
  //         });
  //         setIsLoading(false);
  //       })
  //       .catch((e) => {
  //         console.log(e.message);
  //         setIsError(true);
  //         setIsLoading(false);
  //       });
  //   }, [REACT_APP_IPIFY_API_KEY]);

  // Option 2:split the chain apart in single pieces that you need,
  // and use Promise.all to bring them all together
  //   useEffect(() => {
  //     setIsLoading(true);
  //     const ipData = axios.get(
  //       `https://geo.ipify.org/api/v1?apiKey=${REACT_APP_IPIFY_API_KEY}`
  //     );
  //     const geoData = ipData.then((res) =>
  //       axios.get(
  //         `https://restcountries.eu/rest/v2/alpha/${res.data.location.country}`
  //       )
  //     );
  //     Promise.all([ipData, geoData])
  //       .then(([ip, geo]) => {
  //         setLocation({
  //           ip: ip.data.ip,
  //           lat: ip.data.location.lat,
  //           lng: ip.data.location.lng,
  //           region: ip.data.location.region,
  //           city: ip.data.location.city,
  //           timezone: ip.data.location.timezone,
  //           country: geo.data.name,
  //           countryData: geo.data,
  //         });
  //         setIsLoading(false);
  //       })
  //       .catch((e) => {
  //         console.log(e.message);
  //         setIsError(true);
  //         setIsLoading(false);
  //       });
  //   }, [REACT_APP_IPIFY_API_KEY]);

  // Option 3: use async/await
  useEffect(() => {
    setIsLoading(true);
    const getLocationData = async () => {
      try {
        const { data: ipData } = await axios.get(
          `https://geo.ipify.org/api/v1?apiKey=${REACT_APP_IPIFY_API_KEY}`
        );
        const { data: countryData } = await axios.get(
          `https://restcountries.eu/rest/v2/alpha/${
            ipData && ipData.location.country
          }`
        );
        if (ipData && countryData) {
          setLocation({
            ip: ipData.ip,
            lat: ipData.location.lat,
            lng: ipData.location.lng,
            region: ipData.location.region,
            city: ipData.location.city,
            timezone: ipData.location.timezone,
            country: countryData.name,
            countryData,
          });
          setIsLoading(false);
        } else {
          throw new Error("ipData and countryData were not fetched properly");
        }
      } catch (e) {
        console.log(e.message);
        setIsError(true);
        setIsLoading(false);
      }
    };
    getLocationData();
  }, [REACT_APP_IPIFY_API_KEY]);

  // You can use the geolocation API of the browser to determine
  // a user's location easily (the user will choose whether
  // to accept or not) and more precisely
  // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
  useEffect(() => {
    const message =
      "The map's location will only be based on your IP address 😉";
    if (!navigator.geolocation) {
      cogoToast.warn(
        <div>
          <strong>
            Oh no! Geolocation is not available through your current browser!
          </strong>
          <p>{message}</p>
        </div>
      );
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates([position.coords.latitude, position.coords.longitude]);
          cogoToast.success(
            <div>
              <strong>Thank you for accepting to be geolocated!</strong>
              <p>The map now shows your precise location.</p>
            </div>
          );
        },
        () => {
          cogoToast.warn(
            <div>
              <strong>Geolocation denied!</strong>
              <p>{message}</p>
            </div>
          );
        }
      );
    }
  }, []);

  if (isLoading || isError) {
    return (
      <div className="center">
        {isLoading && <Spinner />}
        {isError && (
          <>
            <Image src={IpLogo} />
            <h1 className="errorText errorBig">
              There was a problem loading your ip/location data{" "}
              <span role="img" aria-label="poop emoji">
                💩
              </span>
            </h1>
            <h2 className="errorText errorSmall">
              please disable your adblocker/extensions and try again{" "}
              <span role="img" aria-label="recycle emoji">
                ♻️
              </span>{" "}
              !
            </h2>
          </>
        )}
        <div className="leaflet-container">
          <UserMap position={bermudaTriangleLocation} zoom={6} />
        </div>
      </div>
    );
  }

  const lat = coordinates ? coordinates[0] : location.lat;
  const lng = coordinates ? coordinates[1] : location.lng;

  return (
    <div className="App">
      <>
        <div className="ipCard">
          <div className="cardHeader">
            <img src={IpLogo} id="ipLogo" alt="What's my IP logo" />
            <h2 className="cardHeaderText">What's My IP?</h2>
          </div>
          <InfoCard data={location} />
        </div>
        <div className="leaflet-container">
          <UserMap position={[lat, lng]} zoom={13} />
        </div>
      </>
    </div>
  );
};

export default App;
