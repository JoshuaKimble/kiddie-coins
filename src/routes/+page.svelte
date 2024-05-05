<script>
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import { onMount } from 'svelte';
	import { loadPeople, savePeople } from './indexedDB';

	let people = [];

	onMount(async () => {
		people = await loadPeople();
	});

	let showModal = false;
	let isAuthenticated = false;
	let isLoading = false;

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

	async function updateCoinCount(index, increment = true) {
		if (!isAuthenticated) {
			alert('You must be signed in to edit coins!');
			return;
		}

		const { coins } = people[index];
		const newCoinCount = increment ? coins + 1 : coins - 1;

		if (newCoinCount < 0) {
			alert('Coin count cannot be negative.');
			return;
		}

		isLoading = true;
		try {
			people[index].coins = newCoinCount;
			await savePeople(people);
		} catch (error) {
			console.error('Failed to update coins:', error);
			alert('Failed to update coins.');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="header">
	<h1>Kiddie Coins</h1>
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
	.plus-minus {
		font-size: 32px;
	}
	.container {
		display: grid;
		grid-template-columns: 1fr; /* Single column for mobile screens */
		grid-gap: 20px;
		padding: 20px;
	}
	@media (min-width: 768px) {
		/* Tablet and larger screens */
		.container {
			grid-template-columns: repeat(
				auto-fit,
				minmax(250px, 1fr)
			); /* Adapts for multiple columns on wider screens */
		}
	}
	.card {
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column; /* Stack image and card body vertically */
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
