import { BASE_URL } from "../constants";

import { type UploadResponseInterface } from "./api.type";

export class CommonApi {
  async uploadImage(formData: FormData): Promise<UploadResponseInterface> {
    const res = await fetch(`${BASE_URL}/uploads`, {
      method: "POST",
      body: formData
    });
    const data = await res.json() as UploadResponseInterface;
    return data;
  }
}
