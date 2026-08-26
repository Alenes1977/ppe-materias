export interface CasUser {
  subject: string;
  email: string | null;
  displayName: string | null;
  attributes: Record<string, unknown>;
}
