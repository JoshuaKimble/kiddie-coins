const dbName = 'KiddieCoinsDB';
const storeName = 'people';
const initialPeople = [
	{ name: 'Everett', coins: 0, img: 'images/everett.webp' },
	{ name: 'Ellison', coins: 0, img: 'images/ellison.webp' },
	{ name: 'River', coins: 0, img: 'images/river.webp' }
];

function openDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, 1);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			let store;
			if (!db.objectStoreNames.contains(storeName)) {
				store = db.createObjectStore(storeName, { keyPath: 'name' });
				initialPeople.forEach((person) => {
					store.add(person);
				});
			}
		};

		request.onsuccess = (event) => {
			const db = event.target.result;
			// Ensure data is initialized before resolving
			db.transaction(storeName).objectStore(storeName).count().onsuccess = (e) => {
				if (e.target.result === 0) {
					// Initialize data if not already present (fallback)
					const tx = db.transaction(storeName, 'readwrite');
					const store = tx.objectStore(storeName);
					initialPeople.forEach((person) => store.add(person));
					tx.oncomplete = () => resolve(db);
					tx.onerror = (txEvent) => reject(txEvent.target.error);
				} else {
					resolve(db);
				}
			};
		};

		request.onerror = (event) => reject(event.target.error);
	});
}

// Add or update people data in the database
export async function savePeople(people) {
	const db = await openDB();
	const transaction = db.transaction(storeName, 'readwrite');
	const store = transaction.objectStore(storeName);

	people.forEach((person) => {
		store.put(person);
	});

	return new Promise((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
	});
}

// Retrieve people data from the database
export async function loadPeople() {
	const db = await openDB();
	const transaction = db.transaction(storeName, 'readonly');
	const store = transaction.objectStore(storeName);

	return new Promise((resolve, reject) => {
		const request = store.getAll();
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
