const { prisma } = require('../src/generated/prisma-client');
const webPush = require('web-push');
const notification = {
	sendNotification: async eventID => {
		const fragment = `
        fragment EventsWithUsers on Event {
          id
         name
        location
        notifyUsers{
              
              endpoint
          }
          
        }
      `;
		const subscribedEvent = await prisma.event({ id: eventID }).$fragment(fragment);
		subscribedEvent.notifyUsers.map(user => {
			notification.sendNotificationBase(JSON.parse(user.endpoint), `Tickets Available For ${subscribedEvent.name}`);
		});
	},

	sendNotificationBase: async (subscription, payload) => {
		// This means we won't resend a notification if the client is offline
		const options = {
			TTL: 0
		};

		if (!subscription.keys) {
			payload = payload || null;
		}

		// web-push's sendNotification function does all the work for us
		try {
			const res = await webPush.sendNotification(subscription, payload, options);
			console.log(res, 'sent!');
		} catch (e) {
			console.log('error sending', e);
		}
	}
};
module.exports = notification;
