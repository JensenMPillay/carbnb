import { BookingQuery } from "@/src/@types/queries.types";
import BookingActionButton from "@/src/components/BookingActionButton";
import {
  DELETE_BOOKING_MUTATION,
  UPDATE_BOOKING_MUTATION,
} from "@/src/lib/graphql/booking";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import { MockedProvider } from "@apollo/client/testing";
import user from "@testing-library/user-event";
import { createGraphQLError } from "graphql-yoga";
import { render, screen } from "../test-utils";

jest.mock("@/src/lib/notifications/toasters");

const successNotifMock = jest.mocked(showNotif);

const errorNotifMock = jest.mocked(showErrorNotif);

describe("BookingActionButton", () => {
  const bookingMock = {
    id: "123",
    startDate: "2024-04-20T00:00:00Z",
    endDate: "2024-04-25T00:00:00Z",
    totalPrice: 250,
    status: "CANCELED",
    paymentStatus: "REFUNDED",
    stripePaymentId: null,
    user: {
      id: "user123",
      email: "user@example.com",
      phone: "1234567890",
      name: "John Doe",
    },
    car: {
      id: "car456",
      category: "SUV",
      brand: "Toyota",
      model: "RAV4",
      year: 2020,
      primaryColor: "Blue",
      trueColor: "Blue",
      transmission: "Automatic",
      fuelType: "Gasoline",
      imageUrl: "https://example.com/car456.jpg",
      pricePerDay: 50,
      available: true,
      user: {
        id: "user789",
      },
      location: {
        id: "location789",
        latitude: 37.7749,
        longitude: -122.4194,
        address: "123 Main St",
        city: "San Francisco",
        postalCode: "94105",
        state: "CA",
        country: "USA",
        formatted_address: "123 Main St, San Francisco, CA 94105, USA",
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    createdAt: "2024-04-15T10:30:00Z",
    updatedAt: "2024-04-15T10:35:00Z",
  } as unknown as BookingQuery;

  it("renders", () => {
    render(
      <MockedProvider mocks={[]}>
        <BookingActionButton bookingId={bookingMock.id} action="ACCEPTED" />
      </MockedProvider>,
    );
  });

  it("should render success state on delete", async () => {
    console.error = jest.fn();
    user.setup();

    const mocks = [
      {
        request: {
          query: DELETE_BOOKING_MUTATION,
          variables: { id: bookingMock.id },
        },
        result: { data: bookingMock },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BookingActionButton bookingId={bookingMock.id} action="DELETED" />
      </MockedProvider>,
    );

    await user.click(screen.getByRole("button"));

    expect(successNotifMock).toHaveBeenCalled();
  });

  it("should render error state on delete", async () => {
    console.error = jest.fn();
    user.setup();

    const mocks = [
      {
        request: {
          query: DELETE_BOOKING_MUTATION,
          variables: { id: bookingMock.id },
        },
        error: new Error("An error occurred"),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BookingActionButton bookingId={bookingMock.id} action="DELETED" />
      </MockedProvider>,
    );

    await user.click(screen.getByRole("button"));

    expect(errorNotifMock).toHaveBeenCalled();
  });

  it("should render graphql error state on delete", async () => {
    console.error = jest.fn();
    user.setup();

    const mocks = [
      {
        request: {
          query: DELETE_BOOKING_MUTATION,
          variables: { id: bookingMock.id },
        },
        result: {
          errors: [createGraphQLError("Error!")],
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BookingActionButton bookingId={bookingMock.id} action="DELETED" />
      </MockedProvider>,
    );

    await user.click(screen.getByRole("button"));

    expect(errorNotifMock).toHaveBeenCalled();
  });

  it("should render success state on update", async () => {
    console.error = jest.fn();
    user.setup();

    const mocks = [
      {
        request: {
          query: UPDATE_BOOKING_MUTATION,
          variables: { id: bookingMock.id, status: "ACCEPTED" },
        },
        result: { data: bookingMock },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BookingActionButton bookingId={bookingMock.id} action="ACCEPTED" />
      </MockedProvider>,
    );

    await user.click(screen.getByRole("button"));

    expect(successNotifMock).toHaveBeenCalled();
  });

  it("should render error state on update", async () => {
    console.error = jest.fn();
    user.setup();

    const mocks = [
      {
        request: {
          query: UPDATE_BOOKING_MUTATION,
          variables: { id: bookingMock.id, status: "ACCEPTED" },
        },
        error: new Error("An error occurred"),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BookingActionButton bookingId={bookingMock.id} action="ACCEPTED" />
      </MockedProvider>,
    );

    await user.click(screen.getByRole("button"));

    expect(errorNotifMock).toHaveBeenCalled();
  });

  it("should render graphql error state on update", async () => {
    console.error = jest.fn();
    user.setup();

    const mocks = [
      {
        request: {
          query: UPDATE_BOOKING_MUTATION,
          variables: { id: bookingMock.id, status: "ACCEPTED" },
        },
        result: {
          errors: [createGraphQLError("Error!")],
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BookingActionButton bookingId={bookingMock.id} action="ACCEPTED" />
      </MockedProvider>,
    );

    await user.click(screen.getByRole("button"));

    expect(errorNotifMock).toHaveBeenCalled();
  });
});
