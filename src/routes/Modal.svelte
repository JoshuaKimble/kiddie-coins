<script>
	import Button from './Button.svelte';

	export let show = false;
	export let authenticate;
	export let close;

	let pin = '';

	const onClick = () => {
		authenticate(pin);
		pin = '';
	};
</script>

{#if show}
	<div class="modal">
		<div class="modal-content">
			<button class="close" on:click={close}>&times;</button>
			<h2>Enter PIN</h2>
			<input
				type="password"
				inputmode="numeric"
				pattern="[0-9]*"
				bind:value={pin}
				placeholder="Enter PIN"
				autocomplete="one-time-code"
			/>
			<Button on:click={onClick} type="submit">Sign In</Button>
		</div>
	</div>
{/if}

<style>
	.modal {
		align-items: center;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		height: 100%;
		justify-content: center;
		left: 0;
		position: fixed;
		top: 0;
		width: 100%;
	}
	.modal-content {
		background-color: white;
		border-radius: 5px;
		padding: 20px;
		text-align: center;
		width: 300px;
	}
	.modal-content > input {
		border-radius: 5px;
		border: 1px solid #333;
		padding: 10px;
	}
	.close {
		background-color: #fff;
		border: none;
		cursor: pointer;
		float: right;
		font-size: 28px;
		padding: 0;
	}
</style>
