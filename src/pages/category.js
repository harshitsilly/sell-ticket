import React from "react";
import { Button, Box, Form, FormField, Text, Footer } from "grommet";
import LocaltionFiler from "../components/localtionFiler";
import DateFiler from "../components/dateFilter";
import CategoryFilter from "../components/categoryFilter";
import AppHeader from "../components/appHeader";

function Category(props) {
  let category = props.match.params[0];
  category = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <>
      <Box>
        <Box height="25vh">
          <AppHeader data={{ currentUser: null }} />
          <Box pad="medium" justify="center" align="center">
            <Text color="#fff" weight="bold" size="large">
              {category}
            </Text>
          </Box>

          <Box background="brand" className="categoryBackground"></Box>
        </Box>
        <Box className="eventBox">
          <LocaltionFiler />
          <DateFiler />
        </Box>
      </Box>
    </>
  );
}
export default Category;
