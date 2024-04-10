import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom";
import { render, screen } from "test-utils";
import { Dog, GET_DOG_QUERY } from "./Example";

it("should render dog", async () => {
  const dogMock = {
    delay: 30, // to prevent React from batching the loading state away
    // delay: Infinity // if you only want to test the loading state

    request: {
      query: GET_DOG_QUERY,
      variables: { name: "Buck" },
    },
    result: {
      data: { dog: { id: 1, name: "Buck", breed: "poodle" } },
    },
  };
  render(
    <MockedProvider mocks={[dogMock]} addTypename={false}>
      <Dog name="Buck" />
    </MockedProvider>,
  );
  expect(await screen.findByText("Loading...")).toBeInTheDocument();
  expect(await screen.findByText("Buck is a poodle")).toBeInTheDocument();
});

it("should show error UI", async () => {
  const dogMock = {
    request: {
      query: GET_DOG_QUERY,
      variables: { name: "Buck" },
    },
    // Error
    error: new Error("An error occurred"),
    // GraphQL Error
    // result: {
    //   errors: [new GraphQLError("Error!")],
    // },
  };
  render(
    <MockedProvider mocks={[dogMock]} addTypename={false}>
      <Dog name="Buck" />
    </MockedProvider>,
  );
  expect(await screen.findByText("An error occurred")).toBeInTheDocument();
});
