import { NextResponse } from "next/server";

import { handleRouteError, jsonError, requireAdminApiSession } from "@/lib/cms/api";
import { mutateCmsStore } from "@/lib/cms/storage";
import {
  NotFoundError,
  booleanValue,
  enumValue,
  requiredNumber,
  requiredString,
  requiredStringArray,
} from "@/lib/cms/validators";

const PRICING_STATUSES = ["active", "draft", "archived"] as const;

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireAdminApiSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();

    const pricingPlan = await mutateCmsStore((store) => {
      const existingPlan = store.pricingPlans.find((item) => item.id === id);
      if (!existingPlan) {
        throw new NotFoundError("Pricing plan not found.");
      }

      existingPlan.name = requiredString(body["name"], "Plan name", 2);
      existingPlan.price = requiredNumber(body["price"], "Price", 0, 999999);
      existingPlan.billingCycle = requiredString(body["billingCycle"], "Billing cycle", 2);
      existingPlan.description = requiredString(body["description"], "Description", 10);
      existingPlan.features = requiredStringArray(body["features"], "Features");
      existingPlan.highlight = booleanValue(body["highlight"]);
      existingPlan.status = enumValue(body["status"], "Status", PRICING_STATUSES);
      existingPlan.ctaLabel = requiredString(body["ctaLabel"], "CTA label", 2);
      existingPlan.position = requiredNumber(body["position"], "Position", 1, 999);
      existingPlan.updatedAt = now;

      return existingPlan;
    });

    return NextResponse.json({ success: true, pricingPlan });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireAdminApiSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const { id } = await context.params;

    await mutateCmsStore((store) => {
      const index = store.pricingPlans.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundError("Pricing plan not found.");
      }

      store.pricingPlans.splice(index, 1);
      return true;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

