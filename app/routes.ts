import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Public - Landing page (manter no root)
  index("routes/_index.tsx"),

  // AUTH - Autenticação e setup
  route("auth/login", "modules/auth/pages/LoginPage.tsx"),
  route("auth/callback", "modules/auth/pages/CallbackPage.tsx"),
  route("auth/setup", "modules/auth/pages/SetupPage.tsx"),
  route("dashboard", "modules/auth/pages/DashboardPage.tsx"),

  // DEMO - Protótipo navegável com dados mockados
  layout("modules/patient/layouts/PatientLayout.tsx", [
    route("demo/patient/timeline", "modules/patient/pages/TimelinePage.tsx"),
    route("demo/patient/evaluations", "modules/patient/pages/MyEvaluationsPage.tsx"),
    route("demo/patient/profile", "modules/patient/pages/HealthProfilePage.tsx"),
    route(
      "demo/patient/request-evaluation",
      "modules/patient/pages/RequestEvaluationPage.tsx"
    ),
  ]),

  layout("modules/nutritionist/layouts/NutritionistLayout.tsx", [
    route("demo/nutritionist/dashboard", "modules/nutritionist/pages/DashboardPage.tsx"),
    route(
      "demo/nutritionist/request/:id",
      "modules/nutritionist/pages/RequestDetailPage.tsx"
    ),
    route(
      "demo/nutritionist/profile",
      "modules/nutritionist/pages/ProfessionalProfilePage.tsx"
    ),
  ]),

  // TODO: Rotas de produção (a serem criadas nos sprints)
  // layout("modules/auth/layouts/AuthLayout.tsx", [
  //   route("auth/login", "modules/auth/pages/LoginPage.tsx"),
  //   route("auth/callback", "modules/auth/pages/CallbackPage.tsx"),
  //   route("auth/setup", "modules/auth/pages/SetupPage.tsx"),
  // ]),
  //
  // layout("modules/app/layouts/PatientAppLayout.tsx", [
  //   route("app/patient/dashboard", "modules/app/patient/pages/DashboardPage.tsx"),
  //   route("app/patient/register-meal", "modules/app/patient/pages/RegisterMealPage.tsx"),
  //   route("app/patient/timeline", "modules/app/patient/pages/TimelinePage.tsx"),
  //   route("app/patient/health-profile", "modules/app/patient/pages/HealthProfilePage.tsx"),
  //   route("app/patient/request-evaluation", "modules/app/patient/pages/RequestEvaluationPage.tsx"),
  //   route("app/patient/evaluation-feedback/:id", "modules/app/patient/pages/EvaluationFeedbackPage.tsx"),
  // ]),
  //
  // layout("modules/app/layouts/NutritionistAppLayout.tsx", [
  //   route("app/nutritionist/dashboard", "modules/app/nutritionist/pages/DashboardPage.tsx"),
  //   route("app/nutritionist/evaluate/:id", "modules/app/nutritionist/pages/EvaluatePage.tsx"),
  // ]),
] satisfies RouteConfig;
