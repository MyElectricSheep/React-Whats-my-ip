import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { REACT_APP_IPIFY_API_KEY } = process.env;

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

  if (isLoading || isError) {
    return (
      <div className="center">
        {isLoading && <Spinner />}
        {isError && (
          <>
            <Image src={IpLogo} />
            <h1 className="errorText errorBig">
              There was a problem loading your location data{" "}
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
          <UserMap position={[location.lat, location.lng]} zoom={13} />
        </div>
      </>
    </div>
  );
};

export default App;
