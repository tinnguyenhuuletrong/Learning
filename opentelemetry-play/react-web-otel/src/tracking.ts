import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
  context,
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  trace,
} from "@opentelemetry/api";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Resource } from "@opentelemetry/resources";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const exporter = new OTLPTraceExporter({
  // optional - url default value is http://localhost:4318/v1/traces
  url: "http://localhost:4318/v1/traces",

  // optional - collection of custom headers to be sent with each request, empty by default
  headers: {},
});
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "web-reactjs",
  [SemanticResourceAttributes.SERVICE_NAMESPACE]: "dev",
});

const provider = new WebTracerProvider({
  resource: Resource.default().merge(resource),
});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));

provider.register({
  // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
  contextManager: new ZoneContextManager(),
});

// Registering instrumentations
registerInstrumentations({
  instrumentations: [new DocumentLoadInstrumentation()],
});

export async function fetchWithTrace(
  requestTraceName: string,
  fetchInfo: RequestInfo,
  fetchOpts?: RequestInit
) {
  const webTracerWithZone = provider.getTracer("fetch-layer");
  const span = webTracerWithZone.startSpan(requestTraceName);

  try {
    span.setAttribute("url", fetchInfo.toString());
    span.setAttribute("method", fetchOpts?.method ?? "get");

    return fetch(fetchInfo, fetchOpts);
  } catch (error: any) {
    span.recordException(error);
  } finally {
    span.end();
  }
}
