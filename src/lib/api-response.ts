import { NextResponse } from "next/server";

export const apiResponse = {
  success: (data?: object, status: number = 200) =>
    NextResponse.json({ success: true, ...data }, { status }),

  error: (error: string, status: number = 400) =>
    NextResponse.json({ success: false, error }, { status }),
};
