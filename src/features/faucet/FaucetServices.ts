import { axiosInstance } from "@/common/api/axiosClient";

export interface CheckEligibilityResp {
  code: number;
  data: {
    is_able_to_faucet: boolean;
  };
  msg: string;
}

interface FaucetResp {
  code: number;
  msg: string;
}

export class FaucetService {
  async checkEligibility(
    address: string
  ): Promise<CheckEligibilityResp["data"]> {
    const resp = await axiosInstance.get<CheckEligibilityResp>(
      `faucet/status?address=${address}`
    );
    return resp.data.data;
  }

  async getFaucet(address: string): Promise<FaucetResp> {
    const resp = await axiosInstance.post<FaucetResp>(
      `/faucet/daily?address=${address}`
    );
    return resp.data;
  }
}
