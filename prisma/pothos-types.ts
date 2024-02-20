/* eslint-disable */
import type { Prisma, User, Session, Car, Booking, Location } from "@prisma/client";
export default interface PrismaTypes {
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        Create: {};
        Update: {};
        RelationName: "cars" | "bookings" | "sessions";
        ListRelations: "cars" | "bookings" | "sessions";
        Relations: {
            cars: {
                Shape: Car[];
                Name: "Car";
                Nullable: false;
            };
            bookings: {
                Shape: Booking[];
                Name: "Booking";
                Nullable: false;
            };
            sessions: {
                Shape: Session[];
                Name: "Session";
                Nullable: false;
            };
        };
    };
    Session: {
        Name: "Session";
        Shape: Session;
        Include: Prisma.SessionInclude;
        Select: Prisma.SessionSelect;
        OrderBy: Prisma.SessionOrderByWithRelationInput;
        WhereUnique: Prisma.SessionWhereUniqueInput;
        Where: Prisma.SessionWhereInput;
        Create: {};
        Update: {};
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
    Car: {
        Name: "Car";
        Shape: Car;
        Include: Prisma.CarInclude;
        Select: Prisma.CarSelect;
        OrderBy: Prisma.CarOrderByWithRelationInput;
        WhereUnique: Prisma.CarWhereUniqueInput;
        Where: Prisma.CarWhereInput;
        Create: {};
        Update: {};
        RelationName: "User" | "Location" | "bookings";
        ListRelations: "bookings";
        Relations: {
            User: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            Location: {
                Shape: Location;
                Name: "Location";
                Nullable: false;
            };
            bookings: {
                Shape: Booking[];
                Name: "Booking";
                Nullable: false;
            };
        };
    };
    Booking: {
        Name: "Booking";
        Shape: Booking;
        Include: Prisma.BookingInclude;
        Select: Prisma.BookingSelect;
        OrderBy: Prisma.BookingOrderByWithRelationInput;
        WhereUnique: Prisma.BookingWhereUniqueInput;
        Where: Prisma.BookingWhereInput;
        Create: {};
        Update: {};
        RelationName: "User" | "Car";
        ListRelations: never;
        Relations: {
            User: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            Car: {
                Shape: Car;
                Name: "Car";
                Nullable: false;
            };
        };
    };
    Location: {
        Name: "Location";
        Shape: Location;
        Include: Prisma.LocationInclude;
        Select: Prisma.LocationSelect;
        OrderBy: Prisma.LocationOrderByWithRelationInput;
        WhereUnique: Prisma.LocationWhereUniqueInput;
        Where: Prisma.LocationWhereInput;
        Create: {};
        Update: {};
        RelationName: "cars";
        ListRelations: "cars";
        Relations: {
            cars: {
                Shape: Car[];
                Name: "Car";
                Nullable: false;
            };
        };
    };
}