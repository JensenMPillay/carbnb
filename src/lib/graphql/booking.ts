import { gql } from "@apollo/client";

// GET_BOOKING_QUERY
export const GET_BOOKING_QUERY = gql`
  query GetBooking($id: String!) {
    getBooking(id: $id) {
      id
      startDate
      endDate
      totalPrice
      status
      stripePaymentId
      user {
        id
        email
        name
        phone
        role
      }
      car {
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
          formatted_address
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

// INIT_BOOKING_MUTATION
export const INIT_BOOKING_MUTATION = gql`
  mutation InitBooking($startDate: Date!, $endDate: Date!, $carId: String!) {
    initBooking(startDate: $startDate, endDate: $endDate, carId: $carId) {
      id
      startDate
      endDate
      totalPrice
      status
      stripePaymentId
      user {
        id
        email
        name
        phone
        role
      }
      car {
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
          formatted_address
        }
        createdAt
        updatedAt
      }
      createdAt
    }
  }
`;

// UPDATE_BOOKING_MUTATION
export const UPDATE_BOOKING_MUTATION = gql`
  mutation InitBooking($startDate: Date, $endDate: Date, $carId: String) {
    initBooking(startDate: $startDate, endDate: $endDate, carId: $carId) {
      id
      startDate
      endDate
      totalPrice
      status
      stripePaymentId
      user {
        id
        email
        name
        phone
        role
      }
      car {
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
          formatted_address
        }
        createdAt
        updatedAt
      }
      createdAt
    }
  }
`;

// DELETE_BOOKING_MUTATION
export const DELETE_BOOKING_MUTATION = gql`
  mutation DeleteBooking($id: String!) {
    deleteBooking(id: $id) {
      id
      startDate
      endDate
      totalPrice
      status
      stripePaymentId
      user {
        id
        email
        name
        phone
        role
      }
      car {
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
          formatted_address
        }
        createdAt
        updatedAt
      }
      createdAt
    }
  }
`;
