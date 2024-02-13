import { gql } from "@apollo/client";

// GET_USER_QUERY
export const GET_USER_QUERY = gql`
  query GetUser {
    getUser {
      id
      email
      emailVerified
      role
      name
      phone
      image
      createdAt
      updatedAt
      cars {
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
    }
  }
`;

// REGISTER_USER_MUTATION
export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser(
    $email: String!
    $name: String!
    $phone: String!
    $role: Role!
  ) {
    registerUser(email: $email, name: $name, phone: $phone, role: $role) {
      id
      email
      emailVerified
      role
      name
      phone
      image
      createdAt
    }
  }
`;

// UPDATE_USER_MUTATION
export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser(
    $email: String
    $password: String
    $name: String
    $phone: String
  ) {
    updateUser(email: $email, password: $password, name: $name, phone: $phone) {
      id
      email
      emailVerified
      role
      name
      phone
      image
      createdAt
      updatedAt
    }
  }
`;

// DELETE_USER_MUTATION
export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser {
    deleteUser {
      id
      email
      emailVerified
      role
      name
      phone
      image
      createdAt
      updatedAt
    }
  }
`;
