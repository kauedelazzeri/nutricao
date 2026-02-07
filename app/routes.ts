import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Public
  index("modules/auth/LoginPage.tsx"),

  // Patient routes (mobile-first)
  layout("modules/patient/layouts/PatientLayout.tsx", [
    route("app/timeline", "modules/patient/pages/TimelinePage.tsx"),
    route("app/evaluations", "modules/patient/pages/MyEvaluationsPage.tsx"),
    route("app/profile", "modules/patient/pages/HealthProfilePage.tsx"),
    route(
      "app/request-evaluation",
      "modules/patient/pages/RequestEvaluationPage.tsx"
    ),
  ]),

  // Nutritionist routes (desktop-first)
  layout("modules/nutritionist/layouts/NutritionistLayout.tsx", [
    route("nutri/dashboard", "modules/nutritionist/pages/DashboardPage.tsx"),
    route(
      "nutri/request/:id",
      "modules/nutritionist/pages/RequestDetailPage.tsx"
    ),
    route(
      "nutri/profile",
      "modules/nutritionist/pages/ProfessionalProfilePage.tsx"
    ),
  ]),
] satisfies RouteConfig;
