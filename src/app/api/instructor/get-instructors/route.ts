import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const instructors = await db.instructor.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return apiResponse.success({ instructors }, 200);
  } catch (error: any) {
    console.error("Get instructors error:", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
