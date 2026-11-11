export type CardType = "pix" | "wifi";
export type PixKeyType = "cpf" | "cnpj" | "telefone" | "email" | "aleatoria";

export type NfcCard = {
  id: string;
  owner_id: string;
  type: CardType;
  slug: string;
  business_name: string;
  pix_holder: string | null;
  pix_key: string | null;
  pix_key_type: PixKeyType | null;
  pix_copy_paste: string | null;
  wifi_ssid: string | null;
  wifi_password: string | null;
  created_at: string;
  updated_at: string;
};

export type CardFormValues = {
  type: CardType;
  business_name: string;
  pix_holder: string;
  pix_key: string;
  pix_key_type: PixKeyType | "";
  pix_copy_paste: string;
  wifi_ssid: string;
  wifi_password: string;
};
