import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return apiResponse.success({ categories }, 200);
  } catch (error: any) {
    console.error("Get categories error:", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
