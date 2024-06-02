const srcPathsPolyglot = [
  "src/controllers/card.controllers.ts",
  "src/controllers/evaluationMetrics.controllers.ts",
  "src/controllers/input.controllers.ts",
  "src/controllers/milestone.controllers.ts",
  "src/controllers/output.controllers.ts",
  "src/controllers/task.controllers.ts",
  "src/routes/card.routes.ts",
  "src/routes/evaluationMetric.routes.ts",
  "src/routes/input.routes.ts",
  "src/routes/milestone.routes.ts",
  "src/routes/output.routes.ts",
  "src/routes/task.routes.ts",
  "src/types/Card.ts",
  "src/types/EvaluationMetric.ts",
  "src/types/GenerativeModels.ts",
  "src/types/Input.ts",
  "src/types/Milestone.ts",
  "src/types/Output.ts",
  "src/types/Task.ts",
  "src/models/card.models.ts",
  "src/models/evaluationMetrics.models.ts",
  "src/models/evaluationMetricTypes.models.ts",
  "src/models/generativeModels.models.ts",
  "src/models/history.models.ts",
  "src/models/input.models.ts",
  "src/models/inputTemplate.models.ts",
  "src/models/inputTemplate.ts",
  "src/models/milestone.models.ts",
  "src/models/task.models.ts",
  "src/models/output.models.ts",
  "src/config/openai.client.ts",
  "src/app.ts",
  "src/server.ts",
  "src/services/evaluation.services.ts",
  "src/services/execution.services.ts",
  "src/utils/promptContext.utils.ts",
  "src/config/openai.client.ts",
];

const basePathPolyglot = "/Users/panciut/backend/";

const controllersPolyglot = srcPathsPolyglot.filter((path) =>
  path.endsWith(".controllers.ts")
);

const routesPolyglot = srcPathsPolyglot.filter((path) =>
  path.endsWith(".routes.ts")
);

const typesPolyglot = srcPathsPolyglot.filter((path) =>
  path.startsWith("src/types")
);

const modelsPolyglot = srcPathsPolyglot.filter((path) =>
  path.endsWith(".models.ts")
);

const servicesPolyglot = srcPathsPolyglot.filter((path) =>
  path.includes("services")
);

const categorizedPaths = [
  ...controllersPolyglot,
  ...routesPolyglot,
  ...typesPolyglot,
  ...modelsPolyglot,
  ...servicesPolyglot,
];
const typesAndModelsPolyglot = typesPolyglot.concat(modelsPolyglot);

const restPolyglot = srcPathsPolyglot.filter(
  (path) => !categorizedPaths.includes(path)
);

module.exports = {
  controllersPolyglot,
  routesPolyglot,
  typesPolyglot,
  modelsPolyglot,
  restPolyglot,
  typesAndModelsPolyglot,
  srcPathsPolyglot,
  servicesPolyglot,
  categorizedPaths,
  basePathPolyglot,
};
