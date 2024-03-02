import { Booking, Car, Location, User } from "@prisma/client";

export type CarQuery = Car & {
  user: Pick<User, "id">;
  location: Location;
};

export type BookingQuery = Booking & {
  user: Pick<User, "id" | "email" | "phone" | "name">;
  car: CarQuery;
};
