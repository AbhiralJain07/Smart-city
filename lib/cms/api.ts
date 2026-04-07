import "server-only";

import { NextResponse } from "next/server";

import { getAdminSession } from "./auth";
import { NotFoundError, ValidationError } from "./validators";

export async function requireAdminApiSession() {
  return getAdminSession();
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof ValidationError) {
    return jsonError(error.message, 400);
  }

  if (error instanceof NotFoundError) {
    return jsonError(error.message, 404);
  }

  console.error(error);
  return jsonError("Something went wrong while processing the request.", 500);
}
