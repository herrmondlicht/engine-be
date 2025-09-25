import { makeOpenAIVisionService } from '../openAIVisionService';

describe('openAIVisionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse JSON content from API response', async () => {
    const mockAxiosInstance = {
      post: jest.fn().mockResolvedValue({
        data: {
          choices: [{ message: { content: '{"license_plate":"AAA1234"}' } }],
        },
      }),
      isAxiosError: jest.fn().mockReturnValue(false),
    };

    const service = makeOpenAIVisionService({ openAIKey: 'key', fetchInstance: mockAxiosInstance });
    const result = await service.parseImage('image');

    expect(result).toEqual({ license_plate: 'AAA1234' });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        model: 'gpt-4-vision-preview',
        messages: expect.any(Array),
      }),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer key',
        },
        timeout: 30000,
      })
    );
  });

  it('should handle API errors with status code', async () => {
    const mockAxiosInstance = {
      post: jest.fn().mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 429,
          statusText: 'Too Many Requests',
          data: { error: 'Rate limit exceeded' },
        },
        message: 'Request failed with status code 429',
      }),
      isAxiosError: jest.fn().mockReturnValue(true),
    };

    const service = makeOpenAIVisionService({ openAIKey: 'key', fetchInstance: mockAxiosInstance });

    await expect(service.parseImage('image')).rejects.toThrow('OpenAI API request failed: 429 Too Many Requests');
  });

  it('should handle timeout errors', async () => {
    const mockAxiosInstance = {
      post: jest.fn().mockRejectedValue({
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      }),
      isAxiosError: jest.fn().mockReturnValue(true),
    };

    const service = makeOpenAIVisionService({ openAIKey: 'key', fetchInstance: mockAxiosInstance, timeout: 5000 });

    await expect(service.parseImage('image')).rejects.toThrow('OpenAI API request timed out');
  });

  it('should handle network errors', async () => {
    const mockAxiosInstance = {
      post: jest.fn().mockRejectedValue({
        isAxiosError: true,
        code: 'ENOTFOUND',
        message: 'getaddrinfo ENOTFOUND api.openai.com',
      }),
      isAxiosError: jest.fn().mockReturnValue(true),
    };

    const service = makeOpenAIVisionService({ openAIKey: 'key', fetchInstance: mockAxiosInstance });

    await expect(service.parseImage('image')).rejects.toThrow('getaddrinfo ENOTFOUND api.openai.com');
  });

  it('should handle invalid JSON responses gracefully', async () => {
    const mockAxiosInstance = {
      post: jest.fn().mockResolvedValue({
        data: {
          choices: [{ message: { content: 'invalid json content' } }],
        },
      }),
      isAxiosError: jest.fn().mockReturnValue(false),
    };

    const service = makeOpenAIVisionService({ openAIKey: 'key', fetchInstance: mockAxiosInstance });
    const result = await service.parseImage('image');
    expect(result).toEqual({ raw: 'invalid json content' });
  });

  it('should handle empty response content', async () => {
    const mockAxiosInstance = {
      post: jest.fn().mockResolvedValue({
        data: {
          choices: [{ message: { content: '' } }],
        },
      }),
      isAxiosError: jest.fn().mockReturnValue(false),
    };

    const service = makeOpenAIVisionService({ openAIKey: 'key', fetchInstance: mockAxiosInstance });
    const result = await service.parseImage('image');
    expect(result).toEqual({});
  });

  it('should handle non-axios errors', async () => {
    const mockAxiosInstance = {
      post: jest.fn().mockRejectedValue(new Error('Some other error')),
      isAxiosError: jest.fn().mockReturnValue(false),
    };

    const service = makeOpenAIVisionService({ openAIKey: 'key', fetchInstance: mockAxiosInstance });

    await expect(service.parseImage('image')).rejects.toThrow('Some other error');
  });
});
