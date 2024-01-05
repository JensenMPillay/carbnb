import { gql } from "@apollo/client";

// Définition de la mutation GraphQL
export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser(
    $email: String!
    $name: String!
    $phone: String!
    $role: Role!
  ) {
    registerUser(email: $email, name: $name, phone: $phone, role: $role) {
      email
      name
      phone
      role
    }
  }
`;
