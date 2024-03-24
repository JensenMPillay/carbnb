import { builder } from "./builder";

import "./types/Booking";
import "./types/Car";
import "./types/Location";
import "./types/User";

/**
 * Builds the schema using the schema builder.
 * @returns The built GraphQL schema.
 */
export const schema = builder.toSchema();
