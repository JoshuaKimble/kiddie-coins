<script>
	import Modal from './components/Modal.svelte';
	import Button from './components/Button.svelte';
	import { onMount } from 'svelte';

	let people = [];

	onMount(async () => {
		const response = await fetch('/api/people');
		if (response.ok) {
			const { data } = await response.json();
			console.log('data:', data);
			people = data;
		} else {
			console.error('failed to fetch people');
		}
	});

	let showModal = false;
	let isAuthenticated = false;
	let isLoading = false;

	const thirtyMinutes = 15 * 60 * 1000;
	setInterval(() => {
		isAuthenticated = false;
	}, thirtyMinutes);

	function getCurrentPin() {
		const now = new Date();
		const mm = String(now.getMonth() + 1).padStart(2, '0');
		const dd = String(now.getDate()).padStart(2, '0');
		const yy = String(now.getFullYear()).slice(-2);
		return mm + dd + yy;
	}

	function checkPin(inputPin) {
		const todayPin = getCurrentPin();
		if (inputPin === todayPin) {
			isAuthenticated = true;
			showModal = false;
		} else {
			alert('Incorrect PIN');
		}
	}

	function toggleModal() {
		showModal = !showModal;
	}

	async function updateCoins(personName, newCoinCount) {
		const response = await fetch('/api/people', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: personName, coins: newCoinCount })
		});
		if (response.ok) {
			console.info('Update was successful');
		} else {
			console.error('Failed to update coins');
		}
	}

	async function updateCoinCount(index, increment = true) {
		if (!isAuthenticated) {
			alert('You must be signed in to edit coins!');
			return;
		}

		const { coins, name } = people[index];
		const newCoinCount = increment ? coins + 1 : coins - 1;

		if (newCoinCount < 0) {
			alert('Coin count cannot be negative.');
			return;
		}

		isLoading = true;
		try {
			await updateCoins(name, newCoinCount);
			people[index].coins = newCoinCount;
		} catch (error) {
			console.error('Failed to update coins:', error);
			alert('Failed to update coins.');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="header">
	<h1><img class="logo" src="/kid-coin.png" alt="coin" />Kid Coins</h1>
	<Button variant="secondary" on:click={toggleModal}>Login</Button>
</div>

<Modal show={showModal} authenticate={checkPin} close={toggleModal} />

<div class="container">
	{#each people as person, index}
		<div class="card">
			<img src={person.img} alt={person.name} class="person-image" />
			<div class="card-body">
				<h3>{person.name}</h3>
				<p>{person.coins} coins</p>
				<Button
					variant="secondary"
					on:click={() => updateCoinCount(index, false)}
					disabled={isLoading}
				>
					<span class="plus-minus">-</span>
				</Button>
				<Button on:click={() => updateCoinCount(index)} disabled={isLoading}>
					<span class="plus-minus">+</span>
				</Button>
			</div>
		</div>
	{/each}
</div>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		background-color: #fff;
		border-bottom: 1px solid #ccc;
	}
	.header .logo {
		width: 34px;
		margin-bottom: -5px;
	}
	.plus-minus {
		font-size: 32px;
	}
	.container {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 20px;
		padding: 20px;
	}
	@media (min-width: 768px) {
		.container {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		}
	}
	.card {
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
	}
	.person-image {
		width: 100%;
		object-fit: cover;
	}
	.card-body {
		padding: 15px;
		text-align: center;
	}
</style>
