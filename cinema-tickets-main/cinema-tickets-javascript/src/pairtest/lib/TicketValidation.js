import { ERROR_MESSAGES } from './constants';
import InvalidPurchaseException from './InvalidPurchaseException';

export const validateTicketsRequest = (
  accountId,
  adultTicketTypeRequest,
  childrenTicketTypeRequest,
  infantsTicketTypeRequest
) => {
  if (accountId < 0) {
    throw new InvalidPurchaseException(ERROR_MESSAGES.INVALID_ACCOUNTID);
  }

  const totalTickets =
    childrenTicketTypeRequest.getNoOfTickets() +
    infantsTicketTypeRequest.getNoOfTickets() +
    adultTicketTypeRequest.getNoOfTickets();

  if (totalTickets > 20) {
    throw new InvalidPurchaseException(ERROR_MESSAGES.TICKET_LIMIT);
  }

  if (
    childrenTicketTypeRequest.getNoOfTickets() > 0 &&
    adultTicketTypeRequest.getNoOfTickets() === 0
  ) {
    throw new InvalidPurchaseException(ERROR_MESSAGES.CHILD_NO_ADULT);
  }

  if (
    infantsTicketTypeRequest.getNoOfTickets() !==
    adultTicketTypeRequest.getNoOfTickets()
  ) {
    throw new InvalidPurchaseException(ERROR_MESSAGES.INFANT_NO_ADULT);
  }
};
