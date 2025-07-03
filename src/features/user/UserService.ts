import { axiosInstance } from "@/common/api/axiosClient";
import { BaseResp } from "@/types";

interface UserProfile extends BaseResp {
  data: {
    user_info: {
      TotalPoints: number;
    };
  };
}

interface CheckinStatus extends BaseResp {
  data: { status: string };
}

interface VerifyTask extends BaseResp {
  data: {
    task_id: number;
    verified: boolean;
  }
}

export class UserService {
  async userProfile(address: string): Promise<UserProfile["data"]> {
    const resp = await axiosInstance.get<UserProfile>(
      `/user/profile?address=${address}`
    );
    return resp.data.data;
  }

  async checkinStatus(address: string): Promise<CheckinStatus> {
    const resp = await axiosInstance.get<CheckinStatus>(
      `/sign/status?address=${address}`
    );
    return resp.data;
  }

  async dailyCheckin(address: string): Promise<BaseResp> {
    const resp = await axiosInstance.post<BaseResp>(
      `/sign/in?address=${address}`
    );
    return resp.data;
  }

  async verifyTask(address: string, task_id: number, tx_hash: string) {
  const resp = await axiosInstance.post<VerifyTask>(
    `/task/verify?address=${address}&task_id=${task_id}&tx_hash=${tx_hash}`
  );

  return resp.data;
}

}
