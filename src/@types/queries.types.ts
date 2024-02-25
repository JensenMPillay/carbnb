import { Booking, Car, Location, User } from "@prisma/client";

export type CarQuery = Car & {
  user: User;
  location: Location;
};

export type BookingQuery = Booking & {
  user: User;
  car: CarQuery;
};
