import TicketPaymentService from '../../thirdparty/paymentgateway/TicketPaymentService';
import SeatReservationService from '../../thirdparty/seatbooking/SeatReservationService';
import InvalidPurchaseException from './InvalidPurchaseException';
import TicketService from './TicketService';
import * as ticketValidation from './TicketValidation';
import { ERROR_MESSAGES } from './constants';

const mockReserveSeat = jest.fn();
jest.mock('../../thirdparty/seatbooking/SeatReservationService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      reserveSeat: mockReserveSeat
    };
  });
});

const mockMakePayment = jest.fn();
jest.mock('../../thirdparty/paymentgateway/TicketPaymentService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      makePayment: mockMakePayment
    };
  });
});

describe('TicketService', () => {
  describe('purchaseTickets', () => {
    const tickets = {
      adult: 1,
      children: 1,
      infants: 1
    };

    it('should return truthy with no services throwing a error calling services with the correct values', () => {
      jest
        .spyOn(ticketValidation, 'validateTicketsRequest')
        .mockImplementation();
      const seatReservationService = SeatReservationService();
      const ticketPaymentService = TicketPaymentService();

      expect(new TicketService().purchaseTickets(0, tickets)).toBeTruthy();

      expect(seatReservationService.reserveSeat).toBeCalledWith(0, 2);
      expect(ticketPaymentService.makePayment).toBeCalledWith(0, 30);
    });

    it('should throw error from validateTicketsRequest', () => {
      jest
        .spyOn(ticketValidation, 'validateTicketsRequest')
        .mockImplementation(() => {
          throw new InvalidPurchaseException('error1');
        });

      try {
        new TicketService().purchaseTickets(0, tickets);
      } catch (ex) {
        expect(ex.message).toEqual('error1');
      }
    });

    it('should throw error from reserveSeat', () => {
      const seatReservationService = SeatReservationService();
      jest
        .spyOn(ticketValidation, 'validateTicketsRequest')
        .mockImplementation();
      jest
        .spyOn(seatReservationService, 'reserveSeat')
        .mockReturnValue(new InvalidPurchaseException('error2'));

      try {
        new TicketService().purchaseTickets(0, tickets);
      } catch (ex) {
        expect(ex.message).toEqual(ERROR_MESSAGES.RESERVE_SEAT);
      }
    });

    it('should throw error from makePayment', () => {
      const seatReservationService = SeatReservationService();
      const ticketPaymentService = TicketPaymentService();
      jest
        .spyOn(ticketValidation, 'validateTicketsRequest')
        .mockImplementation();
      jest.spyOn(seatReservationService, 'reserveSeat').mockImplementation();
      jest
        .spyOn(ticketPaymentService, 'makePayment')
        .mockReturnValue(new InvalidPurchaseException('error3'));

      try {
        new TicketService().purchaseTickets(0, tickets);
      } catch (ex) {
        expect(ex.message).toEqual(ERROR_MESSAGES.MAKE_PAYMENT);
      }
    });
  });
});
