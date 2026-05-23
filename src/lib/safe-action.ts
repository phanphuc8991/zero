import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.log("error.message in action", error.message);
    if (error instanceof Error) return error.message;
    return "Something went wrong";
  },
});
