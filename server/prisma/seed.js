require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
	console.log('🌱 Starting seed...');

	// Clear existing data
	await prisma.ticketsAvailable.deleteMany();
	await prisma.ticketType.deleteMany();
	await prisma.event.deleteMany();
	await prisma.user.deleteMany();

	console.log('✅ Cleared existing data');

	// Create some users
	const users = await Promise.all([
		prisma.user.create({
			data: {
				firstName: 'Rahul',
				lastName: 'Sharma',
				email: 'rahul@example.com',
				password: '$2a$10$YourHashedPasswordHere', // This is a placeholder
				role: 'Customer',
			},
		}),
		prisma.user.create({
			data: {
				firstName: 'Priya',
				lastName: 'Verma',
				email: 'priya@example.com',
				password: '$2a$10$YourHashedPasswordHere',
				role: 'Customer',
			},
		}),
		prisma.user.create({
			data: {
				firstName: 'Admin',
				lastName: 'User',
				email: 'admin@example.com',
				password: '$2a$10$YourHashedPasswordHere',
				role: 'Admin',
			},
		}),
	]);

	console.log('✅ Created users');

	// IPL Sports Events
	const iplEvents = [
		{
			name: 'IPL 2024: Chennai Super Kings vs Mumbai Indians',
			category: 'Sports',
			date: new Date('2024-04-07T19:30:00.000Z'),
			location: 'MA Chidambaram Stadium, Chennai',
			ticketTypes: [
				{ type: 'Premium', count: 500, cost: 2500 },
				{ type: 'Standard', count: 2000, cost: 1200 },
				{ type: 'Economy', count: 3000, cost: 600 },
			],
		},
		{
			name: 'IPL 2024: Royal Challengers Bangalore vs Kolkata Knight Riders',
			category: 'Sports',
			date: new Date('2024-04-10T18:00:00.000Z'),
			location: 'M Chinnaswamy Stadium, Bangalore',
			ticketTypes: [
				{ type: 'Premium', count: 400, cost: 2200 },
				{ type: 'Standard', count: 1800, cost: 1000 },
				{ type: 'Economy', count: 2800, cost: 500 },
			],
		},
		{
			name: 'IPL 2024: Delhi Capitals vs Punjab Kings',
			category: 'Sports',
			date: new Date('2024-04-13T19:30:00.000Z'),
			location: 'Arun Jaitley Stadium, Delhi',
			ticketTypes: [
				{ type: 'Premium', count: 450, cost: 2000 },
				{ type: 'Standard', count: 1900, cost: 900 },
				{ type: 'Economy', count: 3200, cost: 450 },
			],
		},
		{
			name: 'IPL 2024: Rajasthan Royals vs Gujarat Titans',
			category: 'Sports',
			date: new Date('2024-04-16T20:00:00.000Z'),
			location: 'Sawai Mansingh Stadium, Jaipur',
			ticketTypes: [
				{ type: 'Premium', count: 380, cost: 1800 },
				{ type: 'Standard', count: 1700, cost: 800 },
				{ type: 'Economy', count: 2600, cost: 400 },
			],
		},
		{
			name: 'IPL 2024: Lucknow Super Giants vs Sunrisers Hyderabad',
			category: 'Sports',
			date: new Date('2024-04-19T18:00:00.000Z'),
			location: 'BRSABV Ekana Cricket Stadium, Lucknow',
			ticketTypes: [
				{ type: 'Premium', count: 420, cost: 1900 },
				{ type: 'Standard', count: 1750, cost: 850 },
				{ type: 'Economy', count: 2900, cost: 420 },
			],
		},
		{
			name: 'IPL 2024: Qualifier 1',
			category: 'Sports',
			date: new Date('2024-05-20T19:30:00.000Z'),
			location: 'Narendra Modi Stadium, Ahmedabad',
			ticketTypes: [
				{ type: 'Premium', count: 600, cost: 3500 },
				{ type: 'Standard', count: 2500, cost: 1800 },
				{ type: 'Economy', count: 4000, cost: 800 },
			],
		},
		{
			name: 'IPL 2024: Final',
			category: 'Sports',
			date: new Date('2024-05-26T19:30:00.000Z'),
			location: 'Narendra Modi Stadium, Ahmedabad',
			ticketTypes: [
				{ type: 'Premium', count: 800, cost: 5000 },
				{ type: 'Standard', count: 3500, cost: 2500 },
				{ type: 'Economy', count: 5000, cost: 1200 },
			],
		},
	];

	// Concert Events
	const concertEvents = [
		{
			name: 'Karna Aula Live in Concert',
			category: 'Concerts',
			date: new Date('2024-05-15T20:00:00.000Z'),
			location: 'Indira Gandhi Indoor Stadium, New Delhi',
			ticketTypes: [
				{ type: 'VIP', count: 200, cost: 5000 },
				{ type: 'Premium', count: 500, cost: 2500 },
				{ type: 'General', count: 1500, cost: 1200 },
			],
		},
		{
			name: 'Arijit Singh: The Melody Tour',
			category: 'Concerts',
			date: new Date('2024-06-01T19:30:00.000Z'),
			location: 'Jawaharlal Nehru Stadium, Delhi',
			ticketTypes: [
				{ type: 'VIP', count: 300, cost: 6000 },
				{ type: 'Premium', count: 700, cost: 3000 },
				{ type: 'General', count: 2000, cost: 1500 },
			],
		},
		{
			name: 'Shreya Ghoshal: Night of Classics',
			category: 'Concerts',
			date: new Date('2024-06-10T20:00:00.000Z'),
			location: 'NSCI Dome, Mumbai',
			ticketTypes: [
				{ type: 'VIP', count: 250, cost: 4500 },
				{ type: 'Premium', count: 600, cost: 2200 },
				{ type: 'General', count: 1800, cost: 1000 },
			],
		},
		{
			name: 'Diljit Dosanjh: Made for Love Tour',
			category: 'Concerts',
			date: new Date('2024-06-20T19:00:00.000Z'),
			location: 'Pune Cricket Stadium, Pune',
			ticketTypes: [
				{ type: 'VIP', count: 350, cost: 5500 },
				{ type: 'Premium', count: 800, cost: 2800 },
				{ type: 'General', count: 2500, cost: 1300 },
			],
		},
		{
			name: 'Karnataka Rajyotsava Cultural Night',
			category: 'Festivals',
			date: new Date('2024-11-01T18:30:00.000Z'),
			location: 'Kanteerava Stadium, Bangalore',
			ticketTypes: [
				{ type: 'VIP', count: 280, cost: 3500 },
				{ type: 'Premium', count: 650, cost: 1800 },
				{ type: 'General', count: 2200, cost: 800 },
			],
		},
		{
			name: 'Sunburn Festival 2024',
			category: 'Festivals',
			date: new Date('2024-12-28T16:00:00.000Z'),
			location: 'Candolim Beach, Goa',
			ticketTypes: [
				{ type: 'VIP Pass', count: 400, cost: 8000 },
				{ type: 'Premium Pass', count: 1000, cost: 4500 },
				{ type: 'General Entry', count: 3000, cost: 2000 },
			],
		},
		{
			name: 'Raga to Rock: Fusion Night',
			category: 'Music',
			date: new Date('2024-07-15T19:00:00.000Z'),
			location: 'Tata Theatre, Mumbai',
			ticketTypes: [
				{ type: 'VIP', count: 150, cost: 4000 },
				{ type: 'Premium', count: 350, cost: 2000 },
				{ type: 'General', count: 1000, cost: 900 },
			],
		},
	];

	// Combine all events
	const allEvents = [...iplEvents, ...concertEvents];

	// Create events with ticket types and available tickets
	for (const eventData of allEvents) {
		const { ticketTypes, ...eventWithoutTickets } = eventData;

		// Create event
		const event = await prisma.event.create({
			data: {
				...eventWithoutTickets,
				ticketType: {
					create: ticketTypes.map((tt) => ({
						type: tt.type,
						count: tt.count,
					})),
				},
			},
		});

		console.log(`✅ Created event: ${event.name}`);

		// Create TicketsAvailable for each ticket type
		for (const ticketType of ticketTypes) {
			await prisma.ticketsAvailable.create({
				data: {
					passType: ticketType.type,
					numberOfTickets: ticketType.count,
					cost: ticketType.cost,
					comments: `Available tickets for ${ticketType.type}`,
					user: { connect: { id: users[2].id } }, // Connect to admin user
					event: { connect: { id: event.id } },
				},
			});
		}

		console.log(`  ✅ Created ${ticketTypes.length} ticket types for ${event.name}`);
	}

	console.log('🎉 Seed completed successfully!');
	console.log(`Total events created: ${allEvents.length}`);
	console.log(`Total users created: ${users.length}`);
}

main()
	.catch((e) => {
		console.error('❌ Seed failed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
