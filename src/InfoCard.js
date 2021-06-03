import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Image, Grid } from "semantic-ui-react";
import { faClock, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";
import cogoToast from "cogo-toast";

const InfoCard = ({ data: { countryData, ip, city, country } }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(ip);
    cogoToast.success("Your IP address has been copied to the clipboard!");
  };

  return (
    <Grid style={{ height: "50vh" }} container>
      <Grid.Row centered style={{ paddingTop: "0em", paddingBottom: "0em" }}>
        <Card
          raised
          style={{
            width: "60vw",
            maxWidth: "500px",
            minWidth: "200px",
            minHeight: "400px",
            maxHeight: "500px",
          }}
        >
          <Image src={countryData.flag} wrapped ui={false} />
          <Card.Content
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card.Header>
              Your IP address is{" "}
              <span
                onClick={handleCopy}
                className="ipData"
                title="Click to copy!"
              >
                {ip}
              </span>
            </Card.Header>
            <Card.Description>
              You are currently located in {city}, {country}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div>
              <FontAwesomeIcon
                icon={faCalendarAlt}
                style={{ marginRight: "0.3em" }}
              />
              We are the {DateTime.local().toLocaleString()}
            </div>
            <div>
              <FontAwesomeIcon
                icon={faClock}
                style={{ marginRight: "0.3em" }}
              />
              Your local time is{" "}
              {DateTime.local().toLocaleString(DateTime.TIME_SIMPLE)}
            </div>
          </Card.Content>
        </Card>
      </Grid.Row>
    </Grid>
  );
};

export default InfoCard;
