<script>
	import Modal from './components/Modal.svelte';
	import Button from './components/Button.svelte';
	import Spinner from './components/Spinner.svelte';
	import { onMount } from 'svelte';

	let people = [];
	let isPageLoading = false;
	let loadingStates = [];
	let showModal = false;
	let isAuthenticated = false;

	onMount(async () => {
		isPageLoading = true;
		const response = await fetch('/api/people');
		if (response.ok) {
			const { data } = await response.json();
			console.log('data:', data);
			people = data;
			loadingStates = new Array(people.length).fill(false);
		} else {
			console.error('failed to fetch people');
		}
		isPageLoading = false;
	});

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

	let timeoutId;
	let longPressTriggered = false;

	function handlePressStart(index, increment = true) {
		timeoutId = setTimeout(() => {
			updateCoinCount(index, increment, 10);
			longPressTriggered = true;
		}, 1000);
	}

	function handlePressEnd(index, increment = true) {
		clearTimeout(timeoutId);
		if (!longPressTriggered) {
			updateCoinCount(index, increment);
		}
		longPressTriggered = false;
	}

	function handlePressCancel() {
		clearTimeout(timeoutId);
		longPressTriggered = false;
	}

	async function updateCoinCount(index, increment = true, amount = 1) {
		if (!isAuthenticated) {
			alert('You must be signed in to edit coins!');
			return;
		}

		const { coins, name } = people[index];
		const changeAmount = increment ? amount : -amount;
		const newCoinCount = coins + changeAmount;

		if (newCoinCount < 0) {
			alert('Coin count cannot be negative.');
			return;
		}

		loadingStates[index] = true;
		try {
			await updateCoins(name, newCoinCount);
			people[index].coins = newCoinCount;
		} catch (error) {
			console.error('Failed to update coins:', error);
			alert('Failed to update coins.');
		} finally {
			loadingStates[index] = false;
		}
	}
</script>

<div class="header">
	<h1><img class="logo" src="/kid-coin.png" alt="coin" />Kid Coins</h1>
	<Button variant="secondary" on:click={toggleModal}>Login</Button>
</div>

<Modal show={showModal} authenticate={checkPin} close={toggleModal} />

{#if isPageLoading}
	<div class="loading-container">
		<Spinner --size={'10em'} />
	</div>
{:else}
	<div class="container">
		{#each people as person, index}
			<div class="card">
				<img src={`images/${person.img}`} alt={person.name} class="person-image" />
				<div class="card-body">
					<h3>{person.name}</h3>
					<p>{person.coins} coins</p>
					<Button
						variant="secondary"
						on:mousedown={() => handlePressStart(index, false)}
						on:mouseup={() => handlePressEnd(index, false)}
						on:mouseleave={handlePressCancel}
						on:touchstart={() => handlePressStart(index, false)}
						on:touchend={() => handlePressEnd(index, false)}
						on:touchcancel={handlePressCancel}
						disabled={loadingStates[index]}
					>
						<span class="plus-minus">
							{#if loadingStates[index]}
								<Spinner />
							{:else}
								&#45;
							{/if}
						</span>
					</Button>
					<Button
						on:mousedown={() => handlePressStart(index)}
						on:mouseup={() => handlePressEnd(index)}
						on:mouseleave={handlePressCancel}
						on:touchstart={() => handlePressStart(index)}
						on:touchend={() => handlePressEnd(index)}
						on:touchcancel={handlePressCancel}
						disabled={loadingStates[index]}
					>
						<span class="plus-minus">
							{#if loadingStates[index]}
								<Spinner />
							{:else}
								&#43;
							{/if}
						</span>
					</Button>
				</div>
			</div>
		{/each}
	</div>
{/if}

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
		display: inline-block;
		font-size: 38px;
		height: 20px;
		width: 20px;
	}
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 25% 0;
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
