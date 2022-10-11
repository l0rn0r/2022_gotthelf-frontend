<script>
	import { config } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import info from '$lib/assets/text.json';
	import { listen } from 'svelte-idle';
	import { log } from 'fractils';

	listen({
		timer: 4 * 60 * 1000,
		cycle: 1000
	});

	let queryCounter = 0;
	let sentence;
	let dots = '';
	const failedSentence = 'Da ging etwas bei der Abfrage schief.';

	async function query(data) {
		console.log(info[$config.author].api_url)
		const response = await fetch(info[$config.author].api_url, {
			method: 'POST',
			headers: {
				'accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			body: JSON.stringify(data)
		});
		if (response.ok) {
			const result = await response.json();
			console.log(result);
			return result;
		} else {
			queryCounter++;
			console.log('failed');
			console.log(queryCounter);
			await new Promise((r) => setTimeout(r, 3000));
			data.wait_for_model = true;
			return queryCounter <= 30 ? query(data) : failedSentence;
		}
	}

	const payload = {
		sentence: `${$config.input}`,
		temperature: $config.temp,
		top_k: 100,
		num_samples: 1,
		max_new_tokens: 100,
	};

	const trimEnd = (/** @type {string} */ str) => {
		const regex = /(?<=\.)\s+[A-ZÄÖÜ](?:.(?!\.\s+[A-ZÄÖÜ][a-zöäü])){3,}$/g;
		str = str.replace(regex, '');
		str = str.replaceAll(/\s+/g, ' ');
		if (!str.endsWith('.')) {
			str = str + '...';
		}
		return str;
	};

	onMount(async () => {
		setInterval(() => {
			dots = dots === '...' ? '' : dots + '.';
		}, 300);
		if ($config.author && $config.temp && $config.input) {
			console.log(payload);
			sentence = await query(payload);
			console.log(sentence)
		} else {
			console.log('no author or temp or input, redirecting to home');
			goto('/');
		}
	});
</script>

<svelte:head>
	<script src="https://kit.fontawesome.com/903d4f74d4.js" crossorigin="anonymous"></script>
</svelte:head>

<div class="result-container">
	<main>
		<div class="scrollblock">
		{#if sentence}
			<p><small>Input:</small><br>{trimEnd(sentence.input)}</p><hr>
			<p><small>Normalisierte Paraphrasierung:</small><br>{trimEnd(sentence.greedy_output)}</p><hr>
			<p><small>Gotthelf Paraphrasierung:</small><br>{trimEnd(sentence.output[0])}</p>
		{:else}
				<p>Ich schreibe{dots}</p>
		{/if}
		</div>
		<img alt={info[$config.author]?.fullname} src={`${$config?.author || 'gotthelf'}.jpg`} />
	</main>
	<aside>
		<a class="button" href="/" on:click={config.return}>Startseite</a>
		<a class="button" href="/info">Informationen</a>
	</aside>
</div>

<style lang="scss">
	@use '../lib/assets/styles/mixins.scss' as *;
	.result-container {
		height: calc(100vh - 12vw);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	main {
		display: grid;
		grid-template-columns: 1fr 10vw;
		grid-template-rows: 1fr 10vh;
		margin-bottom: -13vw;

		.scrollblock {
			grid-column: 1 / -1;
			@include bluebox;
			p {
				font-size: 2rem;
				margin: 0;
				max-height: 60vh;
				overflow-y: auto;
			}
		}

		img {
			margin-top: 80px;
			grid-column: -2;
			grid-row: -2;
			width: 10vw;
			@include rounded;
		}
	}

	.qr {
		grid-column: 1 / 3;
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.spinner {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	aside {
		display: grid;
		gap: 1rem;
		div {
			grid-row: 2;
		}
		a {
			grid-row: 3;
		}
	}
	.button {
		@include button;
	}
</style>
