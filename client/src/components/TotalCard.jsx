import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const TotalCard = ({ title, value, color }) => {
  return (
    <Card
      sx={{
        minWidth: 200,
        boxShadow: 3,
        marginTop: 8,
        width: "350px", // Set the desired width
        height: "150px", // Set the desired height
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 24, color: "#434343", textAlign: "center" }}
          gutterBottom
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontSize: 50,
            fontWeight: 400,
            color: color,
            textAlign: "center",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TotalCard;
