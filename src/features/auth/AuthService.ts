import { axiosInstance } from "@/common/api/axiosClient";
import { normalizeAxiosError } from "@/common/utils/normalizeAxiosError";
import { BaseResp } from "@/types";

export interface AuthResp extends BaseResp {
  data: {
    jwt: string;
  }
}

export interface LoginParams {
  signature: string;
  address: string;
  wallet?: string;
  inviteCode?: string;
}

export async function login({
  signature,
  address,
  wallet = "MetaMask",
  inviteCode,
}: LoginParams): Promise<AuthResp["data"]> {
  try {
    const params = new URLSearchParams({
      signature,
      wallet,
      address,
    });

    if (inviteCode) {
      params.append("invite_code", inviteCode);
    }

    const response = await axiosInstance.post(
      `/user/login?${params.toString()}`
    );

    return response.data.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}
