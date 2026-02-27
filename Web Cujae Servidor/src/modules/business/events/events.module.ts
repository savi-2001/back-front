import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import {
	Event,
	EventService,
	EventEventListener,
	EventResolver,
	EventHooks,
	EventRestHooks,
	EventController,
} from './event'
import {
	Ticket,
	TicketService,
	TicketEventListener,
	TicketResolver,
	TicketHooks,
	TicketRestHooks,
	TicketController,
} from './ticket'

@Module({
	imports: [TypegooseModule.forFeature([Event]), TypegooseModule.forFeature([Ticket])],
	providers: [
		EventEventListener,
		EventService,
		EventResolver,
		EventHooks,
		EventRestHooks,
		TicketEventListener,
		TicketService,
		TicketResolver,
		TicketHooks,
		TicketRestHooks,
	],
	controllers: [EventController, TicketController],
	exports: [EventService, TicketService],
})
export class EventsModule {}
