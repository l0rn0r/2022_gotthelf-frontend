<script>
	import { config } from '$lib/stores';
	import { goto } from '$app/navigation';
	import info from '$lib/assets/text.json';

	let inputField;

	const handleValidity = (e) => {
		$config.input = e.target.checkValidity() ? e.target.value : '';
		if(inputField.validity.patternMismatch){
			inputField.setCustomValidity('Bitte schreiben Sie maximal 2 Worte.');
			inputField.reportValidity();
		} else {
			inputField.setCustomValidity('');
		}
	}

	const focus = (/** @type {HTMLInputElement} */ node) => {
		node.focus();
	}

</script>

<h2>Was soll ich paraphrasieren?</h2>

<form action="/result" on:submit|preventDefault={() => goto('result')}>
	<p>
		"<input
			type="text"
			pattern=".+"
			bind:this={inputField}
			use:focus
			required
			on:input={handleValidity}
		/>"
	</p>

	<label for="temperature"
		>Soll ich {info[$config.author].genitiv} Wortschatz nutzen? Oder {info[$config.author].pronoun}e Art, Sätze zu formen?
	</label>
	<div class="rangeslider">
		<input id="temperature" type="range" min="0.1" max="0.9" step="0.03" bind:value={$config.temp} />
		<ol>
			<li class:active={$config.temp === 0.1}>Wortschatz</li>
			<li class:active={$config.temp === 0.9}>Satzbau</li>
		</ol>
	</div>

	<button type="submit" class="submit">Paraphrasieren</button>
</form>

<style lang="scss">
	@use '../lib/assets/styles/mixins.scss' as *;

	h2 {
		@include bluebox;
	}
	.rangeslider {
		display: grid;
		input,
		ol {
			grid-column: 1;
			grid-row: 1;
		}

		input {
			z-index: 1;
		}
		ol {
			display: flex;
			list-style-type: none;
			margin: 0;
			padding: 0;
			justify-content: space-between;
			li {
				margin-top: 2rem;
				&.active {
					color: var(--pink);
				}
			}
		}
	}

	form {
		height: fit-content;
		grid-column: 2 / -1;
		grid-row: 2 / span 2;
		@include bluebox;
	}
	input:valid {
		border-color: green;
	}
	input:invalid {
		border-color: red;
	}
	.submit {
		width: 100%;
	}

	label,
	p,
	input[type='text'] {
		font-size: 1.5rem;
	}

	input[type='text'] {
		width: 90%;
	}
</style>
