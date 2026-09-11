import { Router, raw } from "express";
import { tratarWebhookStripeController } from "../controllers/WebhookController";

const webhookRoutes = Router();

webhookRoutes.post(
  "/webhooks/stripe",
  raw({ type: "application/json" }),
  tratarWebhookStripeController,
);

export { webhookRoutes };