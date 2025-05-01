import { JwtPayload, jwtDecode } from "jwt-decode";

interface DecodedToken extends JwtPayload {
  [key: string]: any;
}

export function decodeJwtToken(token?: string): DecodedToken | null | undefined {
  if (!token) return;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}
