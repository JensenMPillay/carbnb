import { gql } from "@apollo/client";

// GET_CAR_QUERY
export const GET_CAR_QUERY = gql`
  query GetCar($id: Int!) {
    getCar(id: $id) {
      id
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
      location {
        id
        latitude
        longitude
        address
        city
        country
      }
      createdAt
      updatedAt
    }
  }
`;

// REGISTER_CAR_MUTATION
export const REGISTER_CAR_MUTATION = gql`
  mutation RegisterCar(
    $category: Category!
    $brand: String!
    $model: String!
    $year: Int
    $transmission: Transmission!
    $fuelType: FuelType!
    $pricePerDay: Float!
    $locationId: String!
  ) {
    registerCar(
      category: $category
      brand: $brand
      model: $model
      year: $year
      transmission: $transmission
      fuelType: $fuelType
      pricePerDay: $pricePerDay
      locationId: $locationId
    ) {
      id
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
      location {
        id
        latitude
        longitude
        address
        city
        country
      }
      createdAt
    }
  }
`;

// UPDATE_CAR_MUTATION
export const UPDATE_CAR_MUTATION = gql`
  mutation UpdateCar(
    $id: Int!
    $category: Category
    $brand: String
    $model: String
    $year: Int
    $transmission: Transmission
    $fuelType: FuelType
    $pricePerDay: Float
    $available: Boolean
    $locationId: String
  ) {
    updateCar(
      id: $id
      category: $category
      brand: $brand
      model: $model
      year: $year
      transmission: $transmission
      fuelType: $fuelType
      pricePerDay: $pricePerDay
      available: $available
      locationId: $locationId
    ) {
      id
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
      location {
        id
        latitude
        longitude
        address
        city
        country
      }
      createdAt
      updatedAt
    }
  }
`;

// DELETE_CAR_MUTATION
export const DELETE_CAR_MUTATION = gql`
  mutation DeleteCar($id: Int!) {
    deleteCar(id: $id) {
      id
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
      location {
        id
        latitude
        longitude
        address
        city
        country
      }
      createdAt
    }
  }
`;
