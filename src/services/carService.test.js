import { makeAddCar } from './carService';

describe('makeAddCar', () => {
  let queryService;
  let mysqlService;
  let addCar;

  beforeEach(() => {
    queryService = {
      getFrom: jest.fn(),
    };
    mysqlService = {
      connectToDB: jest.fn().mockReturnValue('connection'),
      querySQLWithConnection: jest.fn(),
    };
    addCar = makeAddCar({ queryService, mysqlService });
  });

  it('should add a new car when it does not already exist', async () => {
    const data = {
      make: 'Toyota',
      model: 'Corolla',
      year: 2021,
    };
    const insertResult = { affectedRows: 1 };
    const selectResult = { id: 1, ...data };
    const insertMock = jest.fn().mockResolvedValueOnce(insertResult);
    queryService.getFrom.mockReturnValueOnce({ first: jest.fn().mockResolvedValueOnce(null) });
    mysqlService.querySQLWithConnection.mockReturnValue(insertMock);
    queryService.getFrom.mockReturnValueOnce({ first: jest.fn().mockResolvedValueOnce(selectResult) });

    const result = await addCar(data);

    expect(queryService.getFrom).toHaveBeenCalledWith('cars', { query: data });
    expect(mysqlService.connectToDB).toHaveBeenCalled();
    expect(mysqlService.querySQLWithConnection).toHaveBeenCalledWith('connection');
    expect(insertMock).toHaveBeenCalledWith(
      `
        INSERT INTO cars SET ?
        ON DUPLICATE KEY UPDATE
        ?;
    `,
      [data, data]
    );
    expect(queryService.getFrom).toHaveBeenCalledWith('cars', { query: data });
    expect(result).toEqual(selectResult);
  });

  it('should return existing car when it already exists', async () => {
    const data = {
      make: 'Toyota',
      model: 'Corolla',
      year: 2021,
    };
    const existingCar = { id: 1, ...data };
    queryService.getFrom.mockReturnValueOnce({ first: jest.fn().mockResolvedValueOnce(existingCar) });

    const result = await addCar(data);

    expect(queryService.getFrom).toHaveBeenCalledWith('cars', { query: data });
    expect(mysqlService.connectToDB).not.toHaveBeenCalled();
    expect(mysqlService.querySQLWithConnection).not.toHaveBeenCalled();
    expect(result).toEqual(existingCar);
  });
});
