import makeOpenAIVisionService from '../openAIVisionService';

describe('openAIVisionService', () => {
  it('should parse JSON content from API response', async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '{"license_plate":"AAA1234"}' } }],
      }),
    });

    const service = makeOpenAIVisionService({ openAIKey: 'key', fetchFn });
    const result = await service.parseImage('image');
    expect(result).toEqual({ license_plate: 'AAA1234' });
  });
});
