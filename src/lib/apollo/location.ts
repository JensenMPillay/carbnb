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
      country
      cars {
        category
        brand
        model
        year
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
    $latitude: Float!
    $longitude: Float!
    $address: String!
    $city: String!
    $country: String!
  ) {
    registerLocation(
      latitude: $latitude
      longitude: $longitude
      address: $address
      city: $city
      country: $country
    ) {
      id
      latitude
      longitude
      address
      city
      country
    }
  }
`;
