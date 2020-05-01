/* eslint-disable no-restricted-globals */
self.addEventListener('push', function(e) {
	const message = e.data.text();
	console.log(e);
	// The notificationOptions will shape the look and behavior of our notification
	const notificationOptions = {
		body: `${message}`,
		// we use the images from the PWA generator we made
		image: '/sell_ticket/res/mipmap-xhdpi/sell_ticket.png',
		data: {
			dateOfArrival: Date.now(),
			primaryKey: '2'
		},
		actions: [
			{
				action: 'close',
				title: 'Close'
			}
		]
	};
	e.waitUntil(
		// We use the service worker's registration `showNotification` function to display the Notification
		self.registration.showNotification('Tickets Available', notificationOptions)
	);
});
