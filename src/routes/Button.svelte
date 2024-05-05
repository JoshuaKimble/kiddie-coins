<script>
	export let className = '';
	export let variant = 'primary';
	export let type = 'button';
	export let disabled = false;
</script>

<button class="button {variant} {className}" {type} on:click {disabled}>
	<slot></slot>
</button>

<style>
	.button {
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		color: #fff;
		border: none;
	}

	.primary {
		background-color: #007bff;
		border: 1px solid #0056b3;
	}
	.primary:hover {
		background-color: #0056b3;
	}

	.secondary {
		background-color: #fff;
		color: #333;
		border: 1px solid #333;
	}
	.secondary:hover {
		background-color: #f5f5f5;
	}
</style>
