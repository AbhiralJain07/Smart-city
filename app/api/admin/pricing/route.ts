import { NextResponse } from "next/server";

import { handleRouteError, jsonError, requireAdminApiSession } from "@/lib/cms/api";
import { createRecordId, sortPricingPlans } from "@/lib/cms/content";
import { readCmsStore, mutateCmsStore } from "@/lib/cms/storage";
import {
  booleanValue,
  enumValue,
  requiredNumber,
  requiredString,
  requiredStringArray,
} from "@/lib/cms/validators";

const PRICING_STATUSES = ["active", "draft", "archived"] as const;

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdminApiSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  const store = await readCmsStore();
  return NextResponse.json({ pricingPlans: sortPricingPlans(store.pricingPlans) });
}

export async function POST(request: Request) {
  const session = await requireAdminApiSession();
  if (!session) {
    return jsonError("Unauthorized.", 401);
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();

    const pricingPlan = await mutateCmsStore((store) => {
      const nextPlan = {
        id: createRecordId("plan"),
        name: requiredString(body["name"], "Plan name", 2),
        price: requiredNumber(body["price"], "Price", 0, 999999),
        billingCycle: requiredString(body["billingCycle"], "Billing cycle", 2),
        description: requiredString(body["description"], "Description", 10),
        features: requiredStringArray(body["features"], "Features"),
        highlight: booleanValue(body["highlight"]),
        status: enumValue(body["status"], "Status", PRICING_STATUSES),
        ctaLabel: requiredString(body["ctaLabel"], "CTA label", 2),
        position: requiredNumber(body["position"], "Position", 1, 999),
        createdAt: now,
        updatedAt: now,
      };

      store.pricingPlans.push(nextPlan);
      return nextPlan;
    });

    return NextResponse.json({ success: true, pricingPlan }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

