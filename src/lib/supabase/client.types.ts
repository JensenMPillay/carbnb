export interface Session {
  /**
   * The oauth provider token. If present, this can be used to make external API requests to the oauth provider used.
   */
  provider_token?: string | null;
  /**
   * The oauth provider refresh token. If present, this can be used to refresh the provider_token via the oauth provider's API.
   * Not all oauth providers return a provider refresh token. If the provider_refresh_token is missing, please refer to the oauth provider's documentation for information on how to obtain the provider refresh token.
   */
  provider_refresh_token?: string | null;
  /**
   * The access token jwt. It is recommended to set the JWT_EXPIRY to a shorter expiry value.
   */
  access_token: string;
  /**
   * A one-time used refresh token that never expires.
   */
  refresh_token: string;
  /**
   * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
   */
  expires_in: number;
  /**
   * A timestamp of when the token will expire. Returned when a login is confirmed.
   */
  expires_at?: number;
  token_type: string;
  user: User;
}

/**
 * An authentication methord reference (AMR) entry.
 *
 * An entry designates what method was used by the user to verify their
 * identity and at what time.
 *
 * @see {@link GoTrueMFAApi#getAuthenticatorAssuranceLevel}.
 */
export interface AMREntry {
  /** Authentication method name. */
  method: "password" | "otp" | "oauth" | "mfa/totp" | string;

  /**
   * Timestamp when the method was successfully used. Represents number of
   * seconds since 1st January 1970 (UNIX epoch) in UTC.
   */
  timestamp: number;
}

export interface UserIdentity {
  id: string;
  user_id: string;
  identity_data?: {
    [key: string]: any;
  };
  identity_id: string;
  provider: string;
  created_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
}

/**
 * A MFA factor.
 *
 * @see {@link GoTrueMFAApi#enroll}
 * @see {@link GoTrueMFAApi#listFactors}
 * @see {@link GoTrueMFAAdminApi#listFactors}
 */
export interface Factor {
  /** ID of the factor. */
  id: string;

  /** Friendly name of the factor, useful to disambiguate between multiple factors. */
  friendly_name?: string;

  /**
   * Type of factor. Only `totp` supported with this version but may change in
   * future versions.
   */
  factor_type: "totp" | string;

  /** Factor's status. */
  status: "verified" | "unverified";

  created_at: string;
  updated_at: string;
}

export interface UserAppMetadata {
  provider?: string;
  [key: string]: any;
}

export interface UserMetadata {
  [key: string]: any;
}

export interface User {
  id: string;
  app_metadata: UserAppMetadata;
  user_metadata: UserMetadata;
  aud: string;
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_change_sent_at?: string;
  new_email?: string;
  new_phone?: string;
  invited_at?: string;
  action_link?: string;
  email?: string;
  phone?: string;
  created_at: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  updated_at?: string;
  identities?: UserIdentity[];
  factors?: Factor[];
}

export interface UserAttributes {
  /**
   * The user's email.
   */
  email?: string;

  /**
   * The user's phone.
   */
  phone?: string;

  /**
   * The user's password.
   */
  password?: string;

  /**
   * The nonce sent for reauthentication if the user's password is to be updated.
   *
   * Call reauthenticate() to obtain the nonce first.
   */
  nonce?: string;

  /**
   * A custom data object to store the user's metadata. This maps to the `auth.users.user_metadata` column.
   *
   * The `data` should be a JSON object that includes user-specific info, such as their first and last name.
   *
   */
  data?: object;
}

export interface AdminUserAttributes extends Omit<UserAttributes, "data"> {
  /**
   * A custom data object to store the user's metadata. This maps to the `auth.users.user_metadata` column.
   *
   *
   * The `user_metadata` should be a JSON object that includes user-specific info, such as their first and last name.
   *
   * Note: When using the GoTrueAdminApi and wanting to modify a user's metadata,
   * this attribute is used instead of UserAttributes data.
   *
   */
  user_metadata?: object;

  /**
   * A custom data object to store the user's application specific metadata. This maps to the `auth.users.app_metadata` column.
   *
   * Only a service role can modify.
   *
   * The `app_metadata` should be a JSON object that includes app-specific info, such as identity providers, roles, and other
   * access control information.
   */
  app_metadata?: object;

  /**
   * Confirms the user's email address if set to true.
   *
   * Only a service role can modify.
   */
  email_confirm?: boolean;

  /**
   * Confirms the user's phone number if set to true.
   *
   * Only a service role can modify.
   */
  phone_confirm?: boolean;

  /**
   * Determines how long a user is banned for.
   *
   * The format for the ban duration follows a strict sequence of decimal numbers with a unit suffix.
   * Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".
   *
   * For example, some possible durations include: '300ms', '2h45m'.
   *
   * Setting the ban duration to 'none' lifts the ban on the user.
   */
  ban_duration?: string | "none";

  /**
   * The `role` claim set in the user's access token JWT.
   *
   * When a user signs up, this role is set to `authenticated` by default. You should only modify the `role` if you need to provision several levels of admin access that have different permissions on individual columns in your database.
   *
   * Setting this role to `service_role` is not recommended as it grants the user admin privileges.
   */
  role?: string;
}

export interface Subscription {
  /**
   * The subscriber UUID. This will be set by the client.
   */
  id: string;
  /**
   * The function to call every time there is an event. eg: (eventName) => {}
   */
  callback: (event: AuthChangeEvent, session: Session | null) => void;
  /**
   * Call this to remove the listener.
   */
  unsubscribe: () => void;
}

export interface UpdatableFactorAttributes {
  friendlyName: string;
}

export type AuthChangeEventMFA = "MFA_CHALLENGE_VERIFIED";

export type AuthChangeEvent =
  | "INITIAL_SESSION"
  | "PASSWORD_RECOVERY"
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "TOKEN_REFRESHED"
  | "USER_UPDATED"
  | AuthChangeEventMFA;
