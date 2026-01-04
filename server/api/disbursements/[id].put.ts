import { DisbursementService } from '../../services/disbursement/DisbursementService';
import { withErrorHandler } from '../../utils/errorHandler';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Disbursement ID is required',
    });
  }

  const body = await readBody<{
    status: 'pending' | 'approved' | 'denied';
    approvedBy?: string;
    approvedDate?: string;
  }>(event);

  if (!body.status) {
    throw createError({
      statusCode: 400,
      message: 'Status is required',
    });
  }

  if (!['pending', 'approved', 'denied'].includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: 'Status must be pending, approved, or denied',
    });
  }

  return await withErrorHandler(async () => {
    const disbursementService = new DisbursementService();
    const disbursement = await disbursementService.updateStatus(
      id,
      body.status,
      body.approvedBy,
      body.approvedDate ? new Date(body.approvedDate) : undefined
    );

    return {
      success: true,
      disbursement,
    };
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to update disbursement',
  });
});

