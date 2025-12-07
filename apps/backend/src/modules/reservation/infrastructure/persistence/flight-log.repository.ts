import { prisma } from '@libs/database/prisma/prisma';
import { UUID } from '@libs/ddd/uuid.value-object';
import { FlightLogRepositoryPort } from '@modules/reservation/domain/ports/flight-log.repository.port';
import { FlightLogProps } from '@modules/reservation/domain/reservation.types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FlightLogRepository implements FlightLogRepositoryPort {
  private readonly logger = new Logger(FlightLogRepository.name);

  async create(reservationId: UUID, flightLog: FlightLogProps): Promise<void> {
    await prisma.flightLog.create({
      data: {
        id: UUID.random().uuid,
        flightsMinutes: flightLog.flightTimeMinutes.value,
        flightsCount: flightLog.flightCount.value,
        publicComment: flightLog.publicComment ?? null,
        privateComment: flightLog.privateComment ?? null,
        createdAt: new Date(),
        reservation: {
          connect: { id: reservationId.uuid },
        },
      },
    });

    this.logger.log(`FlightLog created for reservation ${reservationId.uuid}`);
  }
}
