import React from "react";
import axios from "axios";

// Semantic UI imports
import { Image, Header } from "semantic-ui-react";

// Custom components imports
import UserMap from "./UserMap";
import InfoCard from "./InfoCard";

// Assets imports
import IpLogo from "./ip-logo.png";

// Styles imports
import "./styles.css";
import "semantic-ui-css/semantic.min.css";

class App extends React.Component {
  state = {};

  // It is possible to chain multiple thens together (on the same level, no callback style imbrication),
  // and make the data flow down the then chain this way:
  // componentDidMount() {
  //   let ipify;
  //   axios
  //     .get(
  //       "https://geo.ipify.org/api/v1?apiKey=at_q0PPYNVebXnhMzJOUModD2NEMlCWC"
  //     )
  //     .then(({ data: ipifyData }) => {
  //       ipify = ipifyData;
  //       return axios.get(
  //         `https://restcountries.eu/rest/v2/alpha/${ipifyData.location.country}`
  //       );
  //     })
  //     .then(({ data: restCountriesData }) => {
  //       this.setState({
  //         ip: ipify.ip,
  //         lat: ipify.location.lat,
  //         lng: ipify.location.lng,
  //         isLoaded: true,
  //         country: restCountriesData.name,
  //         region: ipify.location.region,
  //         city: ipify.location.city,
  //         timezone: ipify.location.timezone,
  //         countryData: restCountriesData
  //       });
  //     })
  //     .catch((e) => console.error(e.message));
  // }

  // Or you could split the chain apart in single pieces that you need,
  // and use Promise.all to bring them all together
  // componentDidMount() {
  //   const ipData = axios.get(
  //     "https://geo.ipify.org/api/v1?apiKey=at_q0PPYNVebXnhMzJOUModD2NEMlCWC"
  //   );
  //   const geoData = ipData.then((res) =>
  //     axios.get(
  //       `https://restcountries.eu/rest/v2/alpha/${res.data.location.country}`
  //     )
  //   );
  //   return Promise.all([ipData, geoData]).then(([ip, geo]) => {
  //     this.setState({
  //       ip: ip.data.ip,
  //       lat: ip.data.location.lat,
  //       lng: ip.data.location.lng,
  //       region: ip.data.location.region,
  //       city: ip.data.location.city,
  //       timezone: ip.data.location.timezone,
  //       country: geo.data.name,
  //       countryData: geo.data,
  //       isLoaded: true
  //     });
  //   });
  // }

  // Or you could also use async/await for an easier way to manage the axios flow:
  // https://javascript.info/async-await
  async componentDidMount() {
    const { data: ipData } = await axios
      .get(
        "https://geo.ipify.org/api/v1?apiKey=at_q0PPYNVebXnhMzJOUModD2NEMlCWC"
      )
      .catch((e) => console.error("Problem fetching the IpData", e.message));

    const { data: countryData } = await axios
      .get(
        `https://restcountries.eu/rest/v2/alpha/${
          ipData && ipData.location.country
        }`
      )
      .catch((e) =>
        console.error("Problem fetching the countryData", e.message)
      );

    if (ipData && countryData) {
      this.setState({
        ip: ipData.ip,
        lat: ipData.location.lat,
        lng: ipData.location.lng,
        region: ipData.location.region,
        city: ipData.location.city,
        timezone: ipData.location.timezone,
        country: countryData.name,
        countryData,
        isLoaded: true
      });
    } else {
      this.setState({
        isProblem: true
      });
    }
  }

  render() {
    return (
      <>
        {this.state.isLoaded && (
          <div className="App">
            <div className="ipCard">
              <Header
                as="h2"
                style={{
                  paddingTop: "1em",
                  paddingRight: window.innerWidth > 450 ? "1em" : "0em",
                  fontFamily: "Patua One, cursive",
                  fontSize: "2.9em",
                  textShadow:
                    "-1px 1px 2px #fff, 1px 1px 2px #fff, 1px -1px 0 #fff, -1px -1px 0 #fff"
                }}
              >
                <Image
                  src={IpLogo}
                  style={window.innerWidth < 450 ? { display: "none" } : {}}
                />{" "}
                What's My IP?
              </Header>
              {this.state.isLoaded && <InfoCard data={this.state} />}
            </div>
            <div className="leaflet-container">
              {this.state.isLoaded && (
                <UserMap position={[this.state.lat, this.state.lng]} />
              )}
            </div>
          </div>
        )}
        {this.state.isProblem && (
          <div className="App">
            <h1>
              There was a problem loading the data; please disable your
              adblocker and try again
            </h1>
          </div>
        )}
      </>
    );
  }
}

export default App;
