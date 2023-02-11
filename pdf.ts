import type { APIGatewayEvent, Context, ProxyCallback } from "aws-lambda";
import * as puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { generateTemplate } from "./src/generateTemplate";
import { transformInputs } from "./src/validateInputs";

export const pdf = async (
  event: APIGatewayEvent,
  context: Context,
  callback: ProxyCallback
) => {
  const IS_OFFLINE = process.env.IS_OFFLINE === "true";
  try {
    const inputValues = transformInputs(event);
    const html = await generateTemplate(
      inputValues.year,
      inputValues.month,
      IS_OFFLINE
    );
    let browser = null;
    try {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        env: {
          DISPLAY: IS_OFFLINE ? ":0" : undefined,
        },
      });

      const page = await browser.newPage();
      await page.setContent(html);
      const pdf = await page.pdf({
        format: "A4",
        displayHeaderFooter: true,
        margin: { top: "1.8cm", right: "1cm", bottom: "1cm", left: "1cm" },
      });

      const response = {
        headers: {
          "Content-type": "application/pdf",
          "content-disposition": "attachment; filename=test.pdf",
        },
        statusCode: 200,
        body: pdf.toString("base64"),
        isBase64Encoded: true,
      };
      return callback(undefined, response);
    } catch (error) {
      if (error instanceof Error) {
        callback(error);
      }
      callback("Error");
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      return callback(e);
    }
    return callback("Error");
  }
};
