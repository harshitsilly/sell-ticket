require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
	const events = await prisma.event.findMany({
		select: {
			id: true,
			name: true,
			category: true,
			date: true,
			location: true,
		},
		orderBy: {
			date: 'asc',
		},
	});

	console.log('=== Events in Database ===');
	console.log(`Total events: ${events.length}\n`);

	events.forEach((event, index) => {
		console.log(`${index + 1}. ${event.name}`);
		console.log(`   Category: ${event.category}`);
		console.log(`   Date: ${event.date}`);
		console.log(`   Location: ${event.location}`);
		console.log('');
	});

	await prisma.$disconnect();
}

checkData().catch(console.error);
