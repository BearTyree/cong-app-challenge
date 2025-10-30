/**
 * API type definitions for request/response payloads
 */

// Send email endpoint types
export interface SendEmailRequest {
  listingId: number;
}

export interface SendEmailResponse {
  message?: string;
  error?: string;
}
