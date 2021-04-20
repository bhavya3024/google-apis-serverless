// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
require('dotenv').config();
const moment = require('moment');
const fetch = require("node-fetch");
const { JSDOM }  =  require('jsdom');

export default async (req, res) => {
  const  { COVID_19_URL, MESSAGING_URL,FROM_NUMBER, TO_NUMBER, MESSAGING_AUTH } = process.env;
  const data = await fetch(COVID_19_URL);
  const text = await data.text();
  const { document } = new JSDOM(text).window;
  const details = document.querySelector(`#newsdate${moment().format('YYYY-MM-DD')} .news_li`)?.textContent;
  if (details) {
   await fetch(MESSAGING_URL, {
      method: 'POST',
      body: JSON.stringify({
          from: { "type": "whatsapp", "number": FROM_NUMBER },
          to: { "type": "whatsapp", "number": TO_NUMBER },
          message: {
            content: {
              type: "text",
              text: details,
            }
          }
        }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: MESSAGING_AUTH,
      }
    });
  }
  return res.status(200).send('OK');
}
