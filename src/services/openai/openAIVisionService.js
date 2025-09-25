export const makeOpenAIVisionService = ({ openAIKey, fetchInstance, timeout = 30000 } = {}) => ({
  async parseImage(base64Image) {
    const body = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You extract car license plates and a list of service items from images. 
            Return ONLY raw JSON like {"license_plate":"ABC1234","items":[{"description":"part","quantity":1,"unit_price":10}]}
            that should be fit to be parsed by JSON.parse(). Do not include markdown or any extra text. If no data is extracted from the image, return an empty object.`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Read the image and return the license plate and parts with quantity and unit price in JSON.' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      temperature: 0,
    };

    try {
      const response = await fetchInstance.post('https://api.openai.com/v1/chat/completions', body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIKey}`,
        },
        timeout,
      });

      const { data } = response;
      const content = data.choices?.[0]?.message?.content || '{}';
      try {
        const parsableContent = content
          .replace(/^```json\s*/i, '')
          .replace(/```$/i, '')
          .trim();
        return JSON.parse(parsableContent);
      } catch (e) {
        console.warn('Failed to parse OpenAI response as JSON:', content);
        return { raw: content };
      }
    } catch (error) {
      if (fetchInstance.isAxiosError(error)) {
        // Handle axios-specific errors
        if (error.code === 'ECONNABORTED') {
          const timeoutError = new Error('OpenAI API request timed out');
          timeoutError.code = 'TIMEOUT';
          throw timeoutError;
        }

        // Handle HTTP errors (4xx, 5xx)
        const httpError = new Error(`OpenAI API request failed: ${error.response?.status} ${error.response?.statusText || error.message}`);
        httpError.status = error.response?.status;
        httpError.statusText = error.response?.statusText;
        httpError.details = error.response?.data;
        throw httpError;
      }

      // Handle other errors
      throw error;
    }
  },
});

export default makeOpenAIVisionService;
