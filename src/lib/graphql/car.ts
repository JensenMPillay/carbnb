import { gql } from "@apollo/client";

// GET_CAR_QUERY
export const GET_CAR_QUERY = gql`
  query GetCar($id: String!) {
    getCar(id: $id) {
      id
      category
      brand
      model
      year
      primaryColor
      trueColor
      transmission
      fuelType
      imageUrl
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
        postalCode
        state
        country
      }
      createdAt
      updatedAt
    }
  }
`;

// GET_AVAILABLE_CARS_QUERY
export const GET_AVAILABLE_CARS_QUERY = gql`
  query GetAvailableCars($startDate: Date!, $endDate: Date!) {
    getAvailableCars(startDate: $startDate, endDate: $endDate) {
      id
      category
      brand
      model
      year
      primaryColor
      trueColor
      transmission
      fuelType
      imageUrl
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
        postalCode
        state
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
    $brand: Brand!
    $model: String!
    $year: Int!
    $primaryColor: Color!
    $trueColor: String!
    $transmission: Transmission!
    $fuelType: FuelType!
    $imageUrl: String!
    $pricePerDay: Int!
    $locationId: String!
  ) {
    registerCar(
      category: $category
      brand: $brand
      model: $model
      year: $year
      primaryColor: $primaryColor
      trueColor: $trueColor
      transmission: $transmission
      fuelType: $fuelType
      imageUrl: $imageUrl
      pricePerDay: $pricePerDay
      locationId: $locationId
    ) {
      id
      category
      brand
      model
      year
      primaryColor
      trueColor
      transmission
      fuelType
      imageUrl
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
        postalCode
        state
        country
      }
      createdAt
    }
  }
`;

// UPDATE_CAR_MUTATION
export const UPDATE_CAR_MUTATION = gql`
  mutation UpdateCar(
    $id: String!
    $category: Category
    $brand: Brand
    $model: String
    $year: Int
    $primaryColor: Color
    $trueColor: String
    $transmission: Transmission
    $fuelType: FuelType
    $imageUrl: String
    $pricePerDay: Int
    $available: Boolean
    $locationId: String
  ) {
    updateCar(
      id: $id
      category: $category
      brand: $brand
      model: $model
      year: $year
      primaryColor: $primaryColor
      trueColor: $trueColor
      transmission: $transmission
      fuelType: $fuelType
      imageUrl: $imageUrl
      pricePerDay: $pricePerDay
      available: $available
      locationId: $locationId
    ) {
      id
      category
      brand
      model
      year
      primaryColor
      trueColor
      transmission
      fuelType
      imageUrl
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
        postalCode
        state
        country
      }
      createdAt
      updatedAt
    }
  }
`;

// DELETE_CAR_MUTATION
export const DELETE_CAR_MUTATION = gql`
  mutation DeleteCar($id: String!) {
    deleteCar(id: $id) {
      id
      category
      brand
      model
      year
      primaryColor
      trueColor
      transmission
      fuelType
      imageUrl
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
        postalCode
        state
        country
      }
      createdAt
    }
  }
`;
