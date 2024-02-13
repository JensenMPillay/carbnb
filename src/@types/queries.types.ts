import { Car, Location, User } from "@prisma/client";

export type CarQuery = Car & {
  user: User;
  location: Location;
};
