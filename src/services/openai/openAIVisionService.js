export const makeOpenAIVisionService = ({ openAIKey, fetchFn = fetch } = {}) => ({
  async parseImage(base64Image) {
    const body = {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content:
            'You extract car license plates and a list of service items from images. Return JSON like {"license_plate":"ABC1234","items":[{"description":"part","quantity":1,"unit_price":10}]}',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Read the image and return the license plate and parts with quantity and unit price in JSON.' },
            { type: 'image_url', image_url: `data:image/jpeg;base64,${base64Image}` },
          ],
        },
      ],
      temperature: 0,
    };

    const response = await fetchFn('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = new Error('OPENAI_REQUEST_FAILED');
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    try {
      return JSON.parse(content);
    } catch (e) {
      return { raw: content };
    }
  },
});

export default makeOpenAIVisionService;
