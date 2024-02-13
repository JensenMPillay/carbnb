import { Car, Location, User } from "@prisma/client";

export type CarData = Car & {
  user: User;
  location: Location;
};
