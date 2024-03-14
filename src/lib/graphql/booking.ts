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
      paymentStatus
      stripePaymentId
      user {
        id
        email
        phone
        name
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

// GET_LENDER_BOOKINGS_QUERY
export const GET_LENDER_BOOKINGS_QUERY = gql`
  query GetLenderBookings {
    getLenderBookings {
      id
      startDate
      endDate
      totalPrice
      status
      paymentStatus
      stripePaymentId
      user {
        id
        email
        phone
        name
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

// GET_RENTER_BOOKINGS_QUERY
export const GET_RENTER_BOOKINGS_QUERY = gql`
  query GetRenterBookings {
    getRenterBookings {
      id
      startDate
      endDate
      totalPrice
      status
      paymentStatus
      stripePaymentId
      user {
        id
        email
        phone
        name
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
      paymentStatus
      stripePaymentId
      user {
        id
        email
        phone
        name
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
  mutation UpdateBooking($id: String!, $status: BookingStatus!) {
    updateBooking(id: $id, status: $status) {
      id
      startDate
      endDate
      totalPrice
      status
      paymentStatus
      stripePaymentId
      user {
        id
        email
        phone
        name
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

// DELETE_BOOKING_MUTATION
export const DELETE_BOOKING_MUTATION = gql`
  mutation DeleteBooking($id: String!) {
    deleteBooking(id: $id) {
      id
      startDate
      endDate
      totalPrice
      status
      paymentStatus
      stripePaymentId
      user {
        id
        email
        phone
        name
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
