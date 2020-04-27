/* eslint-disable no-restricted-globals */
self.addEventListener('push', function(e) {
	const message = e.data;
	console.log(message);
	// The notificationOptions will shape the look and behavior of our notification
	const notificationOptions = {
		body: `Time is the message: ${message}`,
		// we use the images from the PWA generator we made
		icon: '/sell_ticket/mipmap-xhdpi/sell_ticket.png',
		vibrate: [100, 50, 100],
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
		self.registration.showNotification('💊💊 You got notified! 💊💊', notificationOptions)
	);
});
