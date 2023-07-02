import TicketTypeRequest from './TicketTypeRequest.js';
import InvalidPurchaseException from './InvalidPurchaseException.js';
import { validateTicketsRequest } from './TicketValidation.js';
import SeatReservationService from '../../thirdparty/seatbooking/SeatReservationService.js';
import TicketPaymentService from '../../thirdparty/paymentgateway/TicketPaymentService.js';
import { ERROR_MESSAGES, TICKET_TYPES } from './constants';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    const [tickets] = ticketTypeRequests;

    const adultTicketTypeRequest = new TicketTypeRequest(
      TICKET_TYPES.ADULT,
      tickets.adult
    );
    const childrenTicketTypeRequest = new TicketTypeRequest(
      TICKET_TYPES.CHILD,
      tickets.children
    );
    const infantsTicketTypeRequest = new TicketTypeRequest(
      TICKET_TYPES.INFANT,
      tickets.infants
    );

    try {
      validateTicketsRequest(
        accountId,
        adultTicketTypeRequest,
        childrenTicketTypeRequest,
        infantsTicketTypeRequest
      );
    } catch (ex) {
      throw ex;
    }

    try {
      const totalSeatsToAllocate =
        adultTicketTypeRequest.getNoOfTickets() +
        childrenTicketTypeRequest.getNoOfTickets();

      new SeatReservationService().reserveSeat(accountId, totalSeatsToAllocate);
    } catch (ex) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.RESERVE_SEAT);
    }

    try {
      const totalTicketCost =
        adultTicketTypeRequest.getTicketsCost() +
        childrenTicketTypeRequest.getTicketsCost();

      new TicketPaymentService().makePayment(accountId, totalTicketCost);
    } catch (ex) {
      throw new InvalidPurchaseException(ERROR_MESSAGES.MAKE_PAYMENT);
    }

    return true;
  }
}
