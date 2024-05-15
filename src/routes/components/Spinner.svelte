<div class="spinner"></div>

<style>
	.spinner {
		display: inline-block;
		margin: 4px -4px;
		width: var(--size, 20px);
		height: var(--size, 20px);
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: var(--color, #666);
		animation: spin 1s ease-in-out infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
