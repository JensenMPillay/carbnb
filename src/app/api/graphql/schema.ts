import { builder } from "./builder";

import "./types/Booking";
import "./types/Car";
import "./types/Location";
import "./types/User";

// Schema
export const schema = builder.toSchema();
