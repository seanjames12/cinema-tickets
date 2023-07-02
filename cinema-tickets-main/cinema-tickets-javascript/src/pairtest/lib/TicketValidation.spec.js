import { ERROR_MESSAGES, TICKET_TYPES } from './constants';
import { validateTicketsRequest } from './TicketValidation';
import TicketTypeRequest from './TicketTypeRequest';

describe('validateTicketsRequest', () => {
  it.each([
    [-1, 1, 1, 1, ERROR_MESSAGES.INVALID_ACCOUNTID],
    [0, 19, 1, 1, ERROR_MESSAGES.TICKET_LIMIT],
    [0, 0, 1, 0, ERROR_MESSAGES.CHILD_NO_ADULT],
    [0, 0, 0, 1, ERROR_MESSAGES.INFANT_NO_ADULT]
  ])(
    'should throw errorMessage: accountId: %d, adultSize: %d, childSize: %d, infantSize: %d, errorMessage: %s',
    (accountId, adultSize, childSize, infantSize, errorMessage) => {
      try {
        validateTicketsRequest(
          accountId,
          new TicketTypeRequest(TICKET_TYPES.ADULT, adultSize),
          new TicketTypeRequest(TICKET_TYPES.CHILD, childSize),
          new TicketTypeRequest(TICKET_TYPES.INFANT, infantSize)
        );
      } catch (ex) {
        expect(ex.message).toEqual(errorMessage);
      }
    }
  );
});
