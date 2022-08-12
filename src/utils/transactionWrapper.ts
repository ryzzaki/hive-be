import { InternalServerErrorException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

type TransactionWrapper = <T>(
  dataSource: DataSource,
  transactionBody: (_qr: QueryRunner) => Promise<T>,
) => Promise<T>;

const transactionWrapper: TransactionWrapper = async (
  dataSource,
  transactionBody,
) => {
  const qr = dataSource.createQueryRunner();

  await qr.connect();
  await qr.startTransaction();

  try {
    const [result] = await Promise.all([transactionBody(qr)]);
    await qr.commitTransaction();
    return result;
  } catch (e) {
    await qr.rollbackTransaction();
    throw new InternalServerErrorException(
      `Something went wrong! ${e.message}`,
    );
  } finally {
    await qr.release();
  }
};

export default transactionWrapper;
