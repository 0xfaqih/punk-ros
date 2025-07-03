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
}
