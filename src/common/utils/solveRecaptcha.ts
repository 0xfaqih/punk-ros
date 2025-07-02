import { config } from "@/config/config";  
import { axiosInstance } from "@/common/api/axiosClient";

export async function solveRecaptchaV2(): Promise<string> {
  const siteKey = "6Lfx1iwrAAAAAJp_suDVjStYCUs0keW8tQ722uZR";
  const pageUrl = "https://testnet.pharosnetwork.xyz/";

  const apiKey = config.twoCaptchaKey;
  const inUrl = `http://2captcha.com/in.php?key=${apiKey}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${pageUrl}&json=1`;

  const { data: submit } = await axiosInstance.get(inUrl);

  if (submit.status !== 1) {
    throw new Error(`2Captcha error: ${submit.request}`);
  }

  const requestId = submit.request;

  while (true) {
    await new Promise((res) => setTimeout(res, 5000));

    const resUrl = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`;
    const { data: poll } = await axiosInstance.get(resUrl);

    if (poll.status === 1) {
      return poll.request;
    }

    if (poll.request !== "CAPCHA_NOT_READY") {
      throw new Error(`Solve failed: ${poll.request}`);
    }
  }
}
