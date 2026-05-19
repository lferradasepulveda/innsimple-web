exports.handler = async (event) => {
  const tab = event.queryStringParameters?.tab;

  if (!tab) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing tab parameter' }) };
  }

  const sid = process.env.SHEET_ID;
  if (!sid) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Sheet not configured' }) };
  }

  const url = `https://docs.google.com/spreadsheets/d/${sid}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tab)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Google responded with ${res.status}`);
    const text = await res.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=60',
      },
      body: text,
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: e.message }) };
  }
};
