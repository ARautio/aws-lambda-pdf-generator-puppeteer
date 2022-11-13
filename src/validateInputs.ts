import type { APIGatewayEvent } from "aws-lambda";

interface TransformInputsOutput {
  year: number;
  month: number;
}

export function transformInputs(event: APIGatewayEvent): TransformInputsOutput {
  const yearMonth = event?.pathParameters?.yearMonth;
  if (yearMonth && yearMonth.length === 7) {
    const year = Number(yearMonth.substring(0, 4));
    const month = Number(yearMonth.substring(5, 6));
    return { year, month };
  }
  throw new Error("Input is not valid");
}
