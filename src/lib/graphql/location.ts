import { gql } from "@apollo/client";

// GET_LOCATION_QUERY
export const GET_LOCATION_QUERY = gql`
  query GetLocation($id: String!) {
    getLocation(id: $id) {
      id
      latitude
      longitude
      address
      city
      postalCode
      state
      country
      formatted_address
      cars {
        category
        brand
        model
        year
        primaryColor
        trueColor
        transmission
        fuelType
        pricePerDay
        available
        user {
          id
          email
          name
          phone
          role
        }
      }
    }
  }
`;

// REGISTER_LOCATION_MUTATION
export const REGISTER_LOCATION_MUTATION = gql`
  mutation RegisterLocation(
    $id: String!
    $latitude: Float!
    $longitude: Float!
    $address: String!
    $city: String!
    $postalCode: String!
    $state: String!
    $country: String!
    $formatted_address: String!
  ) {
    registerLocation(
      id: $id
      latitude: $latitude
      longitude: $longitude
      address: $address
      city: $city
      postalCode: $postalCode
      state: $state
      country: $country
      formatted_address: $formatted_address
    ) {
      id
      latitude
      longitude
      address
      city
      postalCode
      state
      country
      formatted_address
    }
  }
`;
