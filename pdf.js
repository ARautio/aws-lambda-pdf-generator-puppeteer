'use strict'
const chromium = require('chrome-aws-lambda')
const pug = require('pug')
const fs = require('fs')
const path = require('path')

const knex = require('./src/db')

module.exports.pdf = async (event, context) => {
  const yearMonth = ((event || {}).pathParameters || {}).yearMonth || ''
  const year = yearMonth.length == 7 && yearMonth.substring(0, 4)
  const month = yearMonth.length == 7 && yearMonth.substring(5, 6)

  // Select a date
  const selDate = new Date(year, month)
  const filter = {
    month: selDate.toLocaleString('en', { month: 'long' }),
    year: selDate.getFullYear(),
  }

  // Fetch data with knex
  const result = await knex
    .select()
    .from('sales')
    .where({
      year: filter.year,
      month: selDate.getMonth() + 1,
    })

  const template = pug.compileFile('./src/template.pug')
  const html = template({ ...filter, result })

  let browser = null
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    })

    const page = await browser.newPage()
    page.setContent(html)
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      margin: { top: '1.8cm', right: '1cm', bottom: '1cm', left: '1cm' },
    })

    // TODO: Response with PDF (or error if something went wrong )
    const response = {
      headers: {
        'Content-type': 'application/pdf',
        'content-disposition': 'attachment; filename=test.pdf',
      },
      statusCode: 200,
      body: pdf.toString('base64'),
      isBase64Encoded: true,
    }
    context.succeed(response)
  } catch (error) {
    return context.fail(error)
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }
}
