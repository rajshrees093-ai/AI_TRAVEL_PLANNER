import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUserInStore,
  deleteUserInStore,
  getUserByIdFromStore,
  registerUserInStore,
  updateUserInStore,
} from "@/lib/server-db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "";
    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    const user = await getUserByIdFromStore(userId);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user profile", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action as
      | "SIGNUP"
      | "LOGIN"
      | "UPDATE_PROFILE"
      | "DELETE_ACCOUNT";

    if (action === "SIGNUP") {
      const { name, email, password, homeCity } = body;
      if (!name || !email || !password) {
        return NextResponse.json(
          { error: "Name, email, and password are required." },
          { status: 400 }
        );
      }
      const result = await registerUserInStore({
        name,
        email,
        password,
        homeCity,
      });
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 409 });
      }
      return NextResponse.json({ user: result.user }, { status: 201 });
    }

    if (action === "LOGIN") {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required." },
          { status: 400 }
        );
      }
      const result = await authenticateUserInStore({ email, password });
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 401 });
      }
      return NextResponse.json({ user: result.user }, { status: 200 });
    }

    if (action === "UPDATE_PROFILE") {
      const { userId, updates } = body;
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required." },
          { status: 400 }
        );
      }
      const updated = await updateUserInStore(userId, updates || {});
      if (!updated) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }
      return NextResponse.json({ user: updated }, { status: 200 });
    }

    if (action === "DELETE_ACCOUNT") {
      const { userId } = body;
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required." },
          { status: 400 }
        );
      }
      await deleteUserInStore(userId);
      return NextResponse.json({ deleted: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid auth action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication request failed", details: String(error) },
      { status: 500 }
    );
  }
}
