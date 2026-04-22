export type AdminActionState = {
  ok: boolean;
  message: string;
  media?: Record<string, string>;
};

export const initialAdminActionState: AdminActionState = {
  ok: false,
  message: "",
};
