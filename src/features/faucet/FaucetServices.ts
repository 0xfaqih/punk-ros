import { axiosInstance } from "@/common/api/axiosClient";
import { BaseResp } from "@/types";

export interface CheckEligibilityResp extends BaseResp {
  data: {
    is_able_to_faucet: boolean;
  }
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

  async getFaucet(address: string): Promise<BaseResp> {
    const resp = await axiosInstance.post<BaseResp>(
      `/faucet/daily?address=${address}`
    );
    return resp.data;
  }
}
